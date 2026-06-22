/** Screen keys matching the legacy `showScreen(name, param)` router. */
export type ScreenName =
  | 'dashboard'
  | 'meters'
  | 'meterDetail'
  | 'cases'
  | 'caseDetail'
  | 'diagnostics'
  | 'alerts'
  | 'clusters'
  | 'photos'
  | 'mobile'
  | 'notifications'
  | 'assessment'
  | 'notices'
  | 'appeals'
  | 'analytics'
  | 'compare'
  | 'networkmap'
  | 'dtload'
  | 'forecast'
  | 'nlquery'
  | 'team'
  | 'executive'
  | 'roi'
  | 'reports'
  | 'settings'
  | 'rules'
  | 'dataQuality'
  | 'integrations'
  | 'audit'
  | 'users'
  | 'chartShowcase'
  | 'uiShowcase'
  | 'login'
  | 'consumer'

export interface RouteDefinition {
  path: string
  screen: ScreenName
  title: string
  /** Nav item that should appear active for detail routes */
  parentNav?: ScreenName
}
