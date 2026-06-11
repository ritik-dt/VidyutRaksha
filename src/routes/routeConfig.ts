import type { RouteDefinition } from '@/types'

/** React Router paths mapped from legacy `showScreen` keys. */
export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  { path: '/dashboard', screen: 'dashboard', title: 'Overview' },
  { path: '/meters', screen: 'meters', title: 'Suspicious meters' },
  {
    path: '/meters/:meterId',
    screen: 'meterDetail',
    title: 'Meter detail',
    parentNav: 'meters',
  },
  { path: '/cases', screen: 'cases', title: 'Cases' },
  {
    path: '/cases/:caseId',
    screen: 'caseDetail',
    title: 'Case detail',
    parentNav: 'cases',
  },
  {
    path: '/diagnostics',
    screen: 'diagnostics',
    title: 'Tamper & anomaly reports',
  },
  { path: '/alerts', screen: 'alerts', title: 'Alerts' },
  { path: '/clusters', screen: 'clusters', title: 'Coordinated theft cases' },
  { path: '/photos', screen: 'photos', title: 'Photo evidence' },
  { path: '/mobile', screen: 'mobile', title: 'Inspector field app' },
  { path: '/notifications', screen: 'notifications', title: 'Notifications' },
  { path: '/assessment', screen: 'assessment', title: 'Assessment' },
  { path: '/notices', screen: 'notices', title: 'Consumer notices' },
  { path: '/appeals', screen: 'appeals', title: 'Appeals' },
  { path: '/analytics', screen: 'analytics', title: 'Energy audit' },
  { path: '/compare', screen: 'compare', title: 'Comparative analysis' },
  { path: '/networkmap', screen: 'networkmap', title: 'Network map' },
  { path: '/dtload', screen: 'dtload', title: 'Load management' },
  { path: '/forecast', screen: 'forecast', title: 'Forecast' },
  { path: '/nlquery', screen: 'nlquery', title: 'Ask AI' },
  { path: '/team', screen: 'team', title: 'Team & inspectors' },
  { path: '/executive', screen: 'executive', title: 'Executive view' },
  { path: '/roi', screen: 'roi', title: 'ROI & business case' },
  { path: '/reports', screen: 'reports', title: 'Reports' },
  { path: '/settings', screen: 'settings', title: 'Settings' },
  { path: '/rules', screen: 'rules', title: 'Detection rules' },
  { path: '/data-quality', screen: 'dataQuality', title: 'Data quality' },
  { path: '/integrations', screen: 'integrations', title: 'Integrations' },
  { path: '/audit', screen: 'audit', title: 'Audit trail' },
  { path: '/users', screen: 'users', title: 'Users & roles' },
  {
    path: '/chart-showcase',
    screen: 'chartShowcase',
    title: 'Chart showcase',
  },
  {
    path: '/ui-showcase',
    screen: 'uiShowcase',
    title: 'Shared UI showcase',
  },
  { path: '/login', screen: 'login', title: 'Login' },
  {
    path: '/consumers/:consumerId',
    screen: 'consumer',
    title: 'Consumer detail',
  },
]

export function getRouteByScreen(screen: RouteDefinition['screen']): RouteDefinition {
  const route = ROUTE_DEFINITIONS.find((r) => r.screen === screen)
  if (!route) {
    throw new Error(`No route defined for screen: ${screen}`)
  }
  return route
}
