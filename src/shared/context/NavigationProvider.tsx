import { useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getActiveNavScreen,
  resolveScreenFromPathname,
} from '@/shared/utils/navigation'
import {
  NavigationContext,
  type NavigationContextValue,
} from './NavigationContext'

interface NavigationProviderProps {
  children: ReactNode
}

/**
 * Publishes the router pathname alongside the derived screen name that
 * dependent hooks (`RoleContext`, `ScopeContext`) key their behaviour off.
 * Kept as a thin wrapper so consumers don't have to re-derive the screen
 * name in every module.
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const { pathname } = useLocation()

  const value = useMemo<NavigationContextValue>(() => {
    const { screen } = resolveScreenFromPathname(pathname)
    return {
      pathname,
      currentScreen: screen,
      activeNavScreen: getActiveNavScreen(pathname),
    }
  }, [pathname])

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
