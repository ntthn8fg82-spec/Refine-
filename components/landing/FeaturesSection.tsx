'use client'

import React from 'react'

export function FeaturesSection() {
  const features = [
    {
      icon: '⚙',
      title: '12-Parameter Engine',
      description: 'Control formality, burstiness, vocabulary, hedging, enthusiasm, and more — all in real time.'
    },
    {
      icon: '⚡',
      title: 'Ultra Run Mode',
      description: 'Jump the queue and run at maximum model capacity. For when the output needs to be exceptional.'
    },
    {
      icon: '⊕',
      title: 'Multi-Preset Blending',
      description: 'Stack presets. Scholarly + Shorten. Persuasive + Simple. The engine averages the parameters for a blended result.'
    },
    {
      icon: '↺',
      title: 'Chain Refinements',
      description: 'Push output back to input with one click and refine again with different settings until it is exactly right.'
    },
    {
      icon: '◑',
      title: 'Dark & Light Mode',
      description: 'A full theme system built in. Works across every component. Switch any time without losing your work.'
    },
    {
      icon: '⊞',
      title: 'Multi-Language',
      description: 'Select your language from the nav. Refine is built for global use from day one.'
    }
  ]

  return (
    <section id="features" className="py-16 mx-auto max-w-[1200px] px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 
          className="font-syne font-bold mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)'
          }}
        >
          Built different
        </h2>
        <p 
          className="mx-auto text-[14.5px]"
          style={{
            color: 'var(--text-secondary)',
            maxWidth: '480px'
          }}
        >
          Most paraphrasers give you one output. Refine gives you control over every dimension of the transformation.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{
          background: 'var(--border)'
        }}
      >
        {features.map((feature) => (
          <div 
            key={feature.title}
            className="p-6 transition-all"
            style={{
              background: 'var(--bg-surface)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
          >
            <div 
              className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] mb-4"
              style={{
                background: 'var(--accent-dim)',
                border: '1px solid var(--border-active)',
                fontSize: '17px'
              }}
            >
              {feature.icon}
            </div>
            <h3 
              className="font-syne font-semibold text-[14.5px] mb-2"
              style={{
                color: 'var(--text-primary)'
              }}
            >
              {feature.title}
            </h3>
            <p 
              className="text-[13.5px]"
              style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}