'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/landing/ThemeToggle'

const languages = [
  { code: 'EN', flag: '🇺🇸', name: 'US English' },
  { code: 'ES', flag: '🇪🇸', name: 'Spanish' },
  { code: 'FR', flag: '🇫🇷', name: 'French' },
  { code: 'DE', flag: '🇩🇪', name: 'German' },
  { code: 'JP', flag: '🇯🇵', name: 'Japanese' },
  { code: 'CN', flag: '🇨🇳', name: 'Chinese' }
]

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [language, setLanguage] = useState(languages[0])
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Theme state & observer
  useEffect(() => {
    const html = document.documentElement
    setIsDarkMode(html.dataset.theme !== 'light')

    const observer = new MutationObserver(() => {
      setIsDarkMode(html.dataset.theme !== 'light')
    })
    
    observer.observe(html, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    })

    return () => observer.disconnect()
  }, [])

  // Handle outside clicks for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll to section
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <nav 
      className="sticky top-0 z-[200] h-[62px] flex items-center px-6"
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)'
      }}
    >
      {/* Logo */}
      <div className="flex items-center mr-auto">
        <span 
          className="w-[8px] h-[8px] rounded-full mr-2.5"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 0 10px var(--accent)'
          }}
        />
        <span 
          className="font-syne font-bold text-xl tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Refine
        </span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex gap-8 mx-auto">
        {['Tool', 'Features', 'Pricing'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item.toLowerCase())}
            className="text-[13.5px] tracking-tight font-medium"
            style={{
              color: 'var(--text-secondary)',
              transition: 'color 0.18s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1.5 text-[13px] px-3 py-1 rounded-full"
            style={{
              color: 'var(--text-secondary)',
              transition: 'all 0.18s ease'
            }}
          >
            <span className="text-base -mb-0.5">{language.flag}</span>
            {language.code}
          </button>

          {showLanguageDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-[160px] rounded-lg py-2 shadow-lg"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)'
              }}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang)
                    setShowLanguageDropdown(false)
                  }}
                  className="w-full text-left px-4 py-1.5 text-sm flex items-center gap-2 hover:bg-bg-hover"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Login Button */}
        <Link 
          href="/login"
          className="text-[13px] font-medium px-4 py-1.5 rounded-[100px] transition-all"
          style={{
            background: isDarkMode ? 'white' : 'black',
            color: isDarkMode ? 'black' : 'white'
          }}
        >
          Log In
        </Link>

        {/* Get Started Button */}
        <Link 
          href="/signup"
          className="text-[13px] font-medium px-4 py-1.5 rounded-[100px] text-white transition-all"
          style={{
            background: 'var(--accent)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          Get Started
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </nav>
  )
}
