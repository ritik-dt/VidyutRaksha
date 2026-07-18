import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'

export type RouteErrorBoundaryProps = Omit<ErrorBoundaryProps, 'resetKeys'> & {
  children: ReactNode
}

/**
 * Route-scoped error boundary.
 *
 * Wraps {@link ErrorBoundary} with `resetKeys={[location.key]}` so navigation
 * automatically clears any error state — the user isn't stuck on a stale error
 * card after moving to a different page.
 *
 * Use around `<Outlet />` in the app shell (route-level scope) or around a
 * page's inner tree (module-level scope) when a page-local fallback is
 * preferable.
 */
export function RouteErrorBoundary({
  children,
  ...props
}: RouteErrorBoundaryProps) {
  const location = useLocation()
  return (
    <ErrorBoundary {...props} resetKeys={[location.key]}>
      {children}
    </ErrorBoundary>
  )
}
