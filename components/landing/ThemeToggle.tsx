'use client'

import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const html = document.documentElement
    setIsDarkMode(html.dataset.theme !== 'light')
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const newTheme = isDarkMode ? 'light' : 'dark'
    html.dataset.theme = newTheme
    setIsDarkMode(!isDarkMode)
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      }}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <span className="text-[16px]">☀</span>
      ) : (
        <span className="text-[16px]">☽</span>
      )}
    </button>
  )
}