import { createContext, useContext } from 'react'
import type { Role, RoleId, ScreenName } from '@/shared/types'

export interface RoleContextValue {
  currentRole: Role
  currentRoleId: RoleId
  setCurrentRole: (roleId: RoleId) => void
  isScreenAllowed: (screen: ScreenName) => boolean
  isReadOnly: (screen: ScreenName) => boolean
}

/**
 * Role context — split from `RoleProvider.tsx` so this module exports only
 * non-components. See ThemeContext for the Fast Refresh rationale.
 */
export const RoleContext = createContext<RoleContextValue | null>(null)

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}
