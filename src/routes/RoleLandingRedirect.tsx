import { Navigate } from 'react-router-dom'
import { useRole } from '@/context/RoleContext'
import { getPathForScreen } from '@/utils/navigation'

export function RoleLandingRedirect() {
  const { currentRole } = useRole()
  return <Navigate to={getPathForScreen(currentRole.landing)} replace />
}
