import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
})

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // 1. Verify authentication
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return NextResponse.json(
      { error: 'not_authenticated' },
      { status: 401 }
    )
  }

  // 2. Parse request body
  const { plan } = await request.json()
  if (!['lite', 'standard', 'unlimited'].includes(plan)) {
    return NextResponse.json(
      { error: 'invalid_plan' },
      { status: 400 }
    )
  }

  // 3. Get or create Stripe customer
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Get user profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', session.user.id)
    .single()

  if (profileError) {
    return NextResponse.json(
      { error: 'profile_not_found' },
      { status: 404 }
    )
  }

  let customerId = profile.stripe_customer_id

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: { supabase_user_id: session.user.id }
    })

    // Save customer ID to profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', session.user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'customer_update_failed' },
        { status: 500 }
      )
    }

    customerId = customer.id
  }

  // 4. Create checkout session
  try {
    // Build checkout session params conditionally
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [{
        price: process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`],
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app?upgraded=true`,
      cancel_url: process.env.NEXT_PUBLIC_APP_URL || '',
      metadata: {
        supabase_user_id: session.user.id,
        plan: plan
      }
    }

    // Only add trial for lite/standard plans
    if (plan !== 'unlimited') {
      sessionParams.subscription_data = {
        trial_period_days: 7
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })

  } catch (error) {
    return NextResponse.json(
      { error: 'checkout_error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}