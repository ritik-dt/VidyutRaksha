import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '@/shared/context/RoleContext'
import { useToast } from '@/shared/context/ToastContext'
import {
  getPathForScreen,
  resolveScreenFromPathname,
} from '@/shared/utils/navigation'

export function ProtectedOutlet() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isScreenAllowed, currentRole } = useRole()
  const { showToast } = useToast()
  const lastDeniedScreen = useRef<string | null>(null)

  const { screen } = resolveScreenFromPathname(location.pathname)

  useEffect(() => {
    if (isScreenAllowed(screen)) {
      lastDeniedScreen.current = null
      return
    }

    if (lastDeniedScreen.current === screen) {
      return
    }

    lastDeniedScreen.current = screen
    const landingLabel =
      currentRole.landing.charAt(0).toUpperCase() +
      currentRole.landing.slice(1)

    showToast({
      type: 'warning',
      title: `Not available for ${currentRole.label}`,
      message: `This screen isn't in your role's scope. Redirected to ${landingLabel}.`,
      duration: 3500,
    })
    navigate(getPathForScreen(currentRole.landing), { replace: true })
  }, [
    screen,
    isScreenAllowed,
    currentRole,
    navigate,
    showToast,
    location.pathname,
  ])

  if (!isScreenAllowed(screen)) {
    return null
  }

  return <Outlet />
}
