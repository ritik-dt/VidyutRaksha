import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { ScreenName } from '@/types'
import {
  getActiveNavScreen,
  resolveScreenFromPathname,
} from '@/utils/navigation'

interface NavigationContextValue {
  pathname: string
  currentScreen: ScreenName
  activeNavScreen: ScreenName
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

interface NavigationProviderProps {
  children: ReactNode
}

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

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
