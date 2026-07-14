export type AlertSeverity = 'Critical' | 'Warning' | 'Info'

export type AlertCategoryId = 'all' | 'meter' | 'dt' | 'feeder' | 'system'

export interface AlertItem {
  id: string
  sev: AlertSeverity
  time: string
  ageMin: number
  acked: boolean
  entity: string
  msg: string
  rule: string
  action: string
  cat: Exclude<AlertCategoryId, 'all'>
}

export interface AlertCategory {
  id: AlertCategoryId
  label: string
  icon: string
}

export interface AlertFilter {
  severity?: AlertSeverity
  status?: 'Unacknowledged'
}

export interface AlertStats {
  totalCritical: number
  totalWarning: number
  totalInfo: number
  totalUnacked: number
  totalStale: number
}
