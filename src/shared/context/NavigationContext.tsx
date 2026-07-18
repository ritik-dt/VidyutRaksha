import { createContext, useContext } from 'react'
import type { ScreenName } from '@/shared/types'

export interface NavigationContextValue {
  pathname: string
  currentScreen: ScreenName
  activeNavScreen: ScreenName
}

/**
 * Navigation context — split from `NavigationProvider.tsx` so this module
 * exports only non-components. See ThemeContext for the Fast Refresh
 * rationale.
 */
export const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
