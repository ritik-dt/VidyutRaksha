import type { ScreenName } from '@/shared/types'

export type { EnrichedChildRef, EnrichedLevel } from '@/shared/types/hierarchy'

export interface DiscomRow {
  name: string
  consumers: number
  flagged: number
  critical: number
  confirmed: number
  hitRate: number
  loss: number
  assessment: number
  realization: number
  color: string
}

export interface OvernightDelta {
  label: string
  value: string
  sub: string
  color: string
  bg: string
  border: string
  screen?: ScreenName
}

export interface MainKpiCard {
  label: string
  value: string
  sub: string
  accentColor: string
  valueColor?: string
  screen: ScreenName
  breakdown?: {
    criticalPct: number
    highPct: number
    mediumPct: number
    critical: number
    high: number
    medium: number
  }
}

export interface QueueItem {
  icon: string
  label: string
  meta: string
  action: string
  actionScreen: ScreenName
}

export interface HotspotItem {
  severity: 'red' | 'amber'
  labelHtml: string
  meta: string
  action: string
  actionScreen: ScreenName
}


