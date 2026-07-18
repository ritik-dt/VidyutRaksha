import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/**
 * Theme context.
 *
 * Split from `ThemeProvider.tsx` so this module exports only non-components
 * (context object, hook, types). React Fast Refresh preserves state across
 * edits only when a module exports either all components or all
 * non-components; keeping the seam intact means edits to the provider or its
 * inner effects don't nuke every consumer's state during dev.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
