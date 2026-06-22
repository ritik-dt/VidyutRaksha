import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_ROLE_ID, ROLES } from '@/data/roles'
import type { Role, RoleId, ScreenName } from '@/shared/types'
import { getPathForScreen, isScreenAlwaysAllowed } from '@/shared/utils/navigation'
import { useToast } from './ToastContext'

interface RoleContextValue {
  currentRole: Role
  currentRoleId: RoleId
  setCurrentRole: (roleId: RoleId) => void
  isScreenAllowed: (screen: ScreenName) => boolean
  isReadOnly: (screen: ScreenName) => boolean
}

const ROLE_STORAGE_KEY = 'vidyutraksha-role'

const RoleContext = createContext<RoleContextValue | null>(null)

function readStoredRoleId(): RoleId {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY)
    if (stored && ROLES.some((role) => role.id === stored)) {
      return stored as RoleId
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_ROLE_ID
}

interface RoleProviderProps {
  children: ReactNode
}

export function RoleProvider({ children }: RoleProviderProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [currentRoleId, setCurrentRoleId] = useState<RoleId>(readStoredRoleId)

  const currentRole = useMemo(
    () => ROLES.find((role) => role.id === currentRoleId) ?? ROLES[0],
    [currentRoleId],
  )

  const isScreenAllowed = useCallback(
    (screen: ScreenName) => {
      if (isScreenAlwaysAllowed(screen)) {
        return true
      }
      return currentRole.allowedScreens.includes(screen)
    },
    [currentRole],
  )

  const isReadOnly = useCallback(
    (screen: ScreenName) => currentRole.readOnlyScreens.includes(screen),
    [currentRole],
  )

  const setCurrentRole = useCallback(
    (roleId: RoleId) => {
      const role = ROLES.find((entry) => entry.id === roleId)
      if (!role) {
        return
      }

      setCurrentRoleId(roleId)
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, roleId)
      } catch {
        // ignore persistence errors
      }

      navigate(getPathForScreen(role.landing))
      showToast({
        type: 'success',
        title: `Switched to ${role.label} (${role.level})`,
        message: `Scope: ${role.scope} · Landing on ${role.landing.charAt(0).toUpperCase()}${role.landing.slice(1)}.`,
        duration: 3500,
      })
    },
    [navigate, showToast],
  )

  const value = useMemo(
    () => ({
      currentRole,
      currentRoleId,
      setCurrentRole,
      isScreenAllowed,
      isReadOnly,
    }),
    [currentRole, currentRoleId, setCurrentRole, isScreenAllowed, isReadOnly],
  )

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}
