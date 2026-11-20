import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
export type FontSize = 'normal' | 'large' | 'xlarge'

export type Preferences = {
  theme: Theme
  fontSize: FontSize
}

export const THEME_KEY = 'pipi.theme.v1'
export const FONT_KEY = 'pipi.font.v1'
const PREFERENCES_EVENT = 'pipi:preferences'

const FONT_OPTIONS: FontSize[] = ['normal', 'large', 'xlarge']

function storageGet(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Preferensi tetap berlaku di sesi ini walau penyimpanan diblokir.
  }
}

export function getStoredPreferences(): Preferences {
  const storedTheme = storageGet(THEME_KEY)
  const storedFont = storageGet(FONT_KEY)

  return {
    theme: storedTheme === 'dark' ? 'dark' : 'light',
    fontSize: FONT_OPTIONS.includes(storedFont as FontSize) ? (storedFont as FontSize) : 'normal',
  }
}

export function applyPreferences(preferences: Preferences) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = preferences.theme
  document.documentElement.dataset.font = preferences.fontSize

  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute('content', preferences.theme === 'dark' ? '#081C14' : '#F4FFF1')
}

export function applyStoredPreferences() {
  applyPreferences(getStoredPreferences())
}

export function savePreferences(next: Preferences) {
  storageSet(THEME_KEY, next.theme)
  storageSet(FONT_KEY, next.fontSize)
  applyPreferences(next)
  window.dispatchEvent(new Event(PREFERENCES_EVENT))
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(() => getStoredPreferences())

  useEffect(() => {
    const sync = () => setPreferences(getStoredPreferences())
    window.addEventListener(PREFERENCES_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    savePreferences({ ...getStoredPreferences(), theme })
  }, [])

  const setFontSize = useCallback((fontSize: FontSize) => {
    savePreferences({ ...getStoredPreferences(), fontSize })
  }, [])

  const toggleTheme = useCallback(() => {
    const current = getStoredPreferences()
    savePreferences({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' })
  }, [])

  return { ...preferences, setTheme, setFontSize, toggleTheme }
}
