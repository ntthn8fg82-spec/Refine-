import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { countWords } from '@/lib/utils/wordCount'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // 1. Get authenticated session
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
  if (!session) {
    return NextResponse.json(
      { error: 'not_authenticated' },
      { status: 401 }
    )
  }

  // 2. Service role client for writes
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

  // 3. Get user profile
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('words_used, words_limit, plan')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json(
      { error: 'profile_not_found' },
      { status: 404 }
    )
  }

  // 4. Parse request body
  const { inputText, presetNames, parameters, ultraMode } = await request.json()

  // 5. Check word limit
  if (profile.words_used >= profile.words_limit) {
    return NextResponse.json(
      { error: 'limit_reached' },
      { status: 403 }
    )
  }

  // 6. Check ultra mode eligibility
  if (ultraMode && !['standard', 'unlimited'].includes(profile.plan)) {
    return NextResponse.json(
      { error: 'upgrade_required' },
      { status: 403 }
    )
  }

  // 7. Call Anthropic API
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })

  const prompt = `You are an elite AI writing assistant. Rewrite the text below with absolute precision.

ACTIVE PRESETS: ${presetNames.join(', ')}

PARAMETERS (each is 0-100):
- Perplexity (linguistic unpredictability): ${parameters.perplexity}
- Burstiness (sentence length variation): ${parameters.burstiness} 
- Formality: ${parameters.formality}
- Vocabulary richness: ${parameters.vocabulary}
- First-person usage: ${parameters.firstPerson}
- Hedging language: ${parameters.hedging}
- Repetition for emphasis: ${parameters.repetition}
- Transitional phrasing: ${parameters.transitions}
- Concrete detail density: ${parameters.concrete}
- Paragraph variety: ${parameters.paragraphVar}
- Enthusiasm level: ${parameters.enthusiasm}
- Average sentence length: ${parameters.sentenceLength}
${ultraMode ? 'ULTRA MODE: Maximum reasoning depth. Prioritize nuance, cohesion, and parameter precision above all else.' : ''}

RULES:
- Preserve the core meaning and all key facts
- Output ONLY the rewritten text
- No preamble, no quotation marks

TEXT TO REWRITE:
${inputText}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const refinedText = response.content[0].text
    const outputWordCount = countWords(refinedText)
    const inputWordCount = countWords(inputText)

    // 8. Update database
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ words_used: profile.words_used + outputWordCount })
      .eq('id', session.user.id)

    if (updateError) {
      throw updateError
    }

    // 9. Log usage
    await supabaseAdmin
      .from('usage_logs')
      .insert({
        user_id: session.user.id,
        words_input: inputWordCount,
        words_output: outputWordCount,
        preset: presetNames.join('+')
      })

    return NextResponse.json({ text: refinedText })

  } catch (error) {
    return NextResponse.json(
      { error: 'api_error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}