import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PLANS } from '@/lib/constants'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia'
})

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
async function getRawBody(request: Request): Promise<Buffer> {
  const chunks = []
  for await (const chunk of request.body as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export async function POST(request: Request) {
  const body = await getRawBody(request)
  const signature = request.headers.get('stripe-signature')!
  
  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        await supabase
          .from('profiles')
          .update({
            plan: session.metadata?.plan || 'standard',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            words_limit: PLANS[session.metadata?.plan as keyof typeof PLANS]?.wordLimit,
            trial_ends_at: subscription.trial_end ? 
              new Date(subscription.trial_end * 1000).toISOString() : null
          })
          .eq('id', session.metadata?.supabase_user_id)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const planId = subscription.items.data[0].price.id
        const plan = 
          planId === process.env.STRIPE_LITE_PRICE_ID ? 'lite' :
          planId === process.env.STRIPE_STANDARD_PRICE_ID ? 'standard' :
          planId === process.env.STRIPE_UNLIMITED_PRICE_ID ? 'unlimited' : null

        if (plan) {
          await supabase
            .from('profiles')
            .update({
              plan,
              words_limit: PLANS[plan].words_limit
            })
            .eq('stripe_subscription_id', subscription.id)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            words_limit: PLANS.free.words_limit,
            stripe_subscription_id: null
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.customer) {
          await supabase
            .from('profiles')
            .update({ payment_failed: true })
            .eq('stripe_customer_id', invoice.customer as string)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error },
      { status: 500 }
    )
  }
}
