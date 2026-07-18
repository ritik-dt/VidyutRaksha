import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  LanguageContext,
  type Language,
  type LanguageContextValue,
} from './LanguageContext'
import { useToast } from './ToastContext'

interface LanguageProviderProps {
  children: ReactNode
}

/**
 * Owns the interface language toggle. The pilot supports English only; the
 * Hindi path shows an AI toast explaining what would be localised, so the
 * demo can walk through the UX contract without shipping actual translations.
 * Real i18n (Task 10) will replace this scaffold.
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const { showToast } = useToast()
  const [language, setLanguage] = useState<Language>('EN')

  const toggleLanguage = useCallback(() => {
    setLanguage((current: Language) => {
      const next = current === 'EN' ? 'HI' : 'EN'
      if (next === 'HI') {
        showToast({
          type: 'ai',
          title: '✦ भाषा बदल गई: हिंदी',
          message:
            'Demo: AI briefings, inspector checklists, consumer notices, and assessment letters will be generated in Hindi. (Full product localization will be delivered with v1.1.)',
          duration: 6000,
        })
      }
      return next
    })
  }, [showToast])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isHindi: language === 'HI',
      toggleLanguage,
    }),
    [language, toggleLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
