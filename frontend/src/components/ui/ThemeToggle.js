import React, { useEffect, useState } from 'react'
import Button from './Button'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  const current = document.documentElement.getAttribute('data-theme')
  if (current === 'light' || current === 'dark') return current
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  const label = `Switch to ${next} theme`

  const toggle = () => {
    setTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch (e) {
      // Storage can be unavailable (private mode); the theme still applies for this session.
    }
  }

  return (
    <Button variant='ghost' iconOnly aria-label={label} title={label} onClick={toggle}>
      <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} aria-hidden='true' />
    </Button>
  )
}

export default ThemeToggle
