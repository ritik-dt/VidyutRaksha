import { createContext, useContext } from 'react'

export type Language = 'EN' | 'HI'

export interface LanguageContextValue {
  language: Language
  isHindi: boolean
  toggleLanguage: () => void
}

/**
 * Language context — split from `LanguageProvider.tsx` so this module exports
 * only non-components. See ThemeContext for the Fast Refresh rationale.
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null)

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
