import { ROUTE_DEFINITIONS } from '@/app/routes/routeConfig'
import type { ScreenName } from '@/shared/types'

const DETAIL_PARENTS: Partial<Record<ScreenName, ScreenName>> = {
  meterDetail: 'meters',
  caseDetail: 'cases',
}

const ALWAYS_ALLOWED: ScreenName[] = [
  'login',
  'meterDetail',
  'caseDetail',
  'consumer',
  'chartShowcase',
  'uiShowcase',
]

export function isScreenAlwaysAllowed(screen: ScreenName): boolean {
  return ALWAYS_ALLOWED.includes(screen)
}

export function getPathForScreen(screen: ScreenName, param?: string): string {
  if (screen === 'meterDetail' && param) {
    return `/meters/${encodeURIComponent(param)}`
  }
  if (screen === 'caseDetail' && param) {
    return `/cases/${encodeURIComponent(param)}`
  }
  if (screen === 'consumer' && param) {
    return `/consumers/${encodeURIComponent(param)}`
  }

  const route = ROUTE_DEFINITIONS.find(
    (entry) => entry.screen === screen && !entry.path.includes(':'),
  )
  return route?.path ?? '/dashboard'
}

export function resolveScreenFromPathname(pathname: string): {
  screen: ScreenName
  parentNav?: ScreenName
} {
  for (const route of ROUTE_DEFINITIONS) {
    const pattern = route.path.replace(/:[^/]+/g, '[^/]+')
    if (new RegExp(`^${pattern}$`).test(pathname)) {
      return { screen: route.screen, parentNav: route.parentNav }
    }
  }
  return { screen: 'dashboard' }
}

export function getActiveNavScreen(pathname: string): ScreenName {
  const { screen, parentNav } = resolveScreenFromPathname(pathname)
  return parentNav ?? DETAIL_PARENTS[screen] ?? screen
}
