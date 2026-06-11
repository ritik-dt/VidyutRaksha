import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useToast } from './ToastContext'

type Language = 'EN' | 'HI'

interface LanguageContextValue {
  language: Language
  isHindi: boolean
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { showToast } = useToast()
  const [language, setLanguage] = useState<Language>('EN')

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => {
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

  const value = useMemo(
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

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
