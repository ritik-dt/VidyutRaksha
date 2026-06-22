import { Navigate } from 'react-router-dom'
import { useRole } from '@/shared/context/RoleContext'
import { getPathForScreen } from '@/shared/utils/navigation'

export function RoleLandingRedirect() {
  const { currentRole } = useRole()
  return <Navigate to={getPathForScreen(currentRole.landing)} replace />
}
