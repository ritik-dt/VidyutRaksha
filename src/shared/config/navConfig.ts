import type { ScreenName } from '@/shared/types'

export type NavBadgeVariant = 'default' | 'amber' | 'purple' | 'dim'

export interface NavItemConfig {
  screen: ScreenName
  icon: string
  label: string
  badge?: string
  badgeVariant?: NavBadgeVariant
}

export interface NavSectionConfig {
  id: string
  label: string
  collapsible?: boolean
  tools?: boolean
  defaultCollapsed?: boolean
  items: NavItemConfig[]
}

export const NAV_SECTIONS: NavSectionConfig[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { screen: 'dashboard', icon: '🏛️', label: 'Overview' },
      {
        screen: 'meters',
        icon: '⚠️',
        label: 'Suspicious meters',
        badge: '21',
      },
      {
        screen: 'cases',
        icon: '📋',
        label: 'Cases',
        badge: '14',
        badgeVariant: 'amber',
      },
      {
        screen: 'diagnostics',
        icon: '🚨',
        label: 'Tamper & anomaly reports',
        badge: '8',
        badgeVariant: 'purple',
      },
      {
        screen: 'alerts',
        icon: '🔔',
        label: 'Alerts',
        badge: '3',
      },
    ],
  },
  // {
  //   id: 'operations',
  //   label: 'Field Operations',
  //   collapsible: true,
  //   items: [
  //     {
  //       screen: 'clusters',
  //       icon: '🎯',
  //       label: 'Coordinated theft cases',
  //     },
  //     { screen: 'photos', icon: '📷', label: 'Photo evidence' },
  //     { screen: 'mobile', icon: '📱', label: 'Inspector field app' },
  //     { screen: 'notifications', icon: '💬', label: 'Notifications' },
  //   ],
  // },
  // {
  //   id: 'recovery',
  //   label: 'Recovery Workflow',
  //   collapsible: true,
  //   items: [
  //     { screen: 'assessment', icon: '💰', label: 'Assessment' },
  //     { screen: 'notices', icon: '✉️', label: 'Consumer notices' },
  //     {
  //       screen: 'appeals',
  //       icon: '⚖️',
  //       label: 'Appeals',
  //       badge: '2',
  //       badgeVariant: 'dim',
  //     },
  //   ],
  // },
  // {
  //   id: 'analysis',
  //   label: 'Analysis & Insights',
  //   collapsible: true,
  //   items: [
  //     { screen: 'analytics', icon: '📈', label: 'Energy audit' },
  //     { screen: 'compare', icon: '⇄', label: 'Comparative analysis' },
  //     { screen: 'networkmap', icon: '🗺️', label: 'Network map' },
  //     { screen: 'dtload', icon: '⚡', label: 'Load management' },
  //     { screen: 'forecast', icon: '🔮', label: 'Forecast' },
  //     { screen: 'nlquery', icon: '✨', label: 'Ask AI' },
  //   ],
  // },
  // {
  //   id: 'team',
  //   label: 'Team & Reports',
  //   collapsible: true,
  //   items: [
  //     { screen: 'team', icon: '👥', label: 'Team & inspectors' },
  //     { screen: 'executive', icon: '🏛️', label: 'Executive view' },
  //     { screen: 'roi', icon: '💼', label: 'ROI & business case' },
  //     { screen: 'reports', icon: '📄', label: 'Reports' },
  //   ],
  // },
  // {
  //   id: 'tools',
  //   label: 'System',
  //   collapsible: true,
  //   tools: true,
  //   defaultCollapsed: true,
  //   items: [
  //     { screen: 'settings', icon: '⚙️', label: 'Settings' },
  //     { screen: 'rules', icon: '🎛', label: 'Detection rules' },
  //     { screen: 'dataQuality', icon: '📡', label: 'Data quality' },
  //     { screen: 'integrations', icon: '🔌', label: 'Integrations' },
  //     { screen: 'audit', icon: '📝', label: 'Audit trail' },
  //     { screen: 'users', icon: '👤', label: 'Users & roles' },
  //   ],
  // },
]
