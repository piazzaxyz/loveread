import { createContext, useContext, useEffect, useState } from 'react'
import { mochaTheme } from '@/styles/themes/catppuccin-mocha'
import { latteRoseTheme } from '@/styles/themes/catppuccin-latte-rose'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('cantinho-theme') as Theme) || 'dark'
  })

  useEffect(() => {
    const vars = theme === 'dark' ? mochaTheme : latteRoseTheme
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
    root.setAttribute('data-theme', theme)
    localStorage.setItem('cantinho-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
