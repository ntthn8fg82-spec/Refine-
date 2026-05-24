'use client'

import Link from 'next/link'

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 mx-auto max-w-[1100px] px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="font-syne font-bold text-clamp(1.5rem,2.5vw,2rem) mb-4">
          Simple pricing
        </h2>
        <p 
          className="mx-auto text-[14.5px] max-w-[520px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Start with 1,500 free words. Upgrade when you need more power, more volume, or no limits at all.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lite Plan */}
        <div className="p-6 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border)'
          }}
        >
          <h3 className="font-syne font-bold text-lg mb-1">Lite</h3>
          <div 
            className="mb-2" 
            style={{
              fontSize: '2.4rem',
              fontFamily: 'var(--font-syne)',
              fontWeight: '700'
            }}
          >
            $5<span className="text-sm font-normal text-text-secondary">/month</span>
          </div>
          <div className="text-[13px] text-success mb-3">7 days free — card required</div>
          <div className="text-[15px] mb-4" style={{ color: 'var(--accent)' }}>10,000 words / month</div>
          <p className="text-[13.5px] text-text-secondary mb-4">For light users who need reliable access without the wait.</p>
          
          <ul className="space-y-2 mb-6">
            {['10,000 words per month', 'All 7 presets', 'Full filter control', 'Multi-preset blending', 'No queue wait'].map(item => (
              <li key={item} className="flex items-start text-[13.5px] text-text-secondary">
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '6px',
                  marginRight: '8px',
                  background: 'var(--accent)'
                }} />
                {item}
              </li>
            ))}
            <li className="flex items-start text-[13.5px] text-text-muted">
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                flexShrink: 0,
                marginTop: '6px',
                marginRight: '8px',
                background: 'var(--text-muted)'
              }} />
              Ultra Run not included
            </li>
          </ul>

          <Link 
            href="/signup"
            className="inline-flex w-full justify-center rounded-[100px] px-4 py-2 text-sm font-medium border transition-all"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
              e.currentTarget.style.borderColor = 'var(--border-active)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            Start 7-day free trial
          </Link>
        </div>

        {/* Standard Plan (Featured) */}
        <div className="p-6 rounded-lg border relative"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent)'
          }}
        >
          <div className="absolute top-0 right-5 -translate-y-1/2 bg-bg-surface px-3 py-1 rounded-full text-[11px] font-medium"
            style={{ color: 'var(--accent)' }}
          >
            Most Popular
          </div>
          
          <h3 className="font-syne font-bold text-lg mb-1">Standard</h3>
          <div 
            className="mb-2" 
            style={{
              fontSize: '2.4rem',
              fontFamily: 'var(--font-syne)',
              fontWeight: '700'
            }}
          >
            $15<span className="text-sm font-normal text-text-secondary">/month</span>
          </div>
          <div className="text-[13px] text-success mb-3">7 days free — card required</div>
          <div className="text-[15px] mb-4" style={{ color: 'var(--accent)' }}>25,000 words / month</div>
          <p className="text-[13.5px] text-text-secondary mb-4">For writers, students, and professionals who use Refine daily.</p>

          <ul className="space-y-2 mb-6">
            {['25,000 words per month', 'All 7 presets', 'Full filter control', 'Multi-preset blending', 'Ultra Run mode included', 'No queue wait', 'Chain refinement history'].map(item => (
              <li key={item} className="flex items-start text-[13.5px] text-text-secondary">
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '6px',
                  marginRight: '8px',
                  background: 'var(--accent)'
                }} />
                {item}
              </li>
            ))}
          </ul>

          <Link 
            href="/signup"
            className="inline-flex w-full justify-center rounded-[100px] px-4 py-2 text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Start 7-day free trial
          </Link>
        </div>

        {/* Unlimited Plan */}
        <div className="p-6 rounded-lg border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border)'
          }}
        >
          <h3 className="font-syne font-bold text-lg mb-1">Unlimited</h3>
          <div 
            className="mb-2" 
            style={{
              fontSize: '2.4rem',
              fontFamily: 'var(--font-syne)',
              fontWeight: '700'
            }}
          >
            $35<span className="text-sm font-normal text-text-secondary">/month</span>
          </div>
          <div className="text-[15px] mb-4" style={{ color: 'var(--accent)' }}>Unlimited words</div>
          <p className="text-[13.5px] text-text-secondary mb-4">For power users and heavy workflows. No caps, no wait, top of the line.</p>

          <ul className="space-y-2 mb-6">
            {['Unlimited words', 'All 7 presets', 'Full filter control', 'Multi-preset blending', 'Ultra Run included', 'Top priority processing', 'Chain refinement history', 'Priority support'].map(item => (
              <li key={item} className="flex items-start text-[13.5px] text-text-secondary">
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: '6px',
                  marginRight: '8px',
                  background: 'var(--accent)'
                }} />
                {item}
              </li>
            ))}
          </ul>

          <Link 
            href="/signup"
            className="inline-flex w-full justify-center rounded-[100px] px-4 py-2 text-sm font-medium border transition-all"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
              e.currentTarget.style.borderColor = 'var(--border-active)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            Get Unlimited
          </Link>
          <p style={{ 
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '8px' 
          }}>
            No trial — immediate access.
          </p>
        </div>
      </div>
    </section>
  )
}