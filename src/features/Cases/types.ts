import type { HierNodeType } from '@/shared/types'

export type CaseStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Escalated'
  | 'Confirmed Theft'
  | 'False Positive'
  | 'Closed'
  | 'Past SLA'

export type CaseListSortKey = 'due' | 'risk' | 'created' | 'assignee'

export interface CaseRecord {
  id: string
  meter: string
  consumer: string
  risk: number
  area: string
  status: CaseStatus
  assignee: string
  created: string
  due: string
  flags: number
  scopeId: string
  category?: string
  overdueDays?: number
  estValue?: number
  _real?: boolean
  _account?: string
  _activity?: string
  _tariff?: string
  _load?: number
  _load_unit?: string
  _zone?: string
}

export interface CasesStats {
  total: number
  pastSla: number
  open: number
  inProgress: number
  escalated: number
  confirmed: number
  closed: number
  avgClose: number
  recovery: number
  active: number
}

export interface CasesHierarchyRow {
  id: string
  name: string
  type: HierNodeType | string
  total: number
  pastSla: number
  open: number
  inProgress: number
  confirmed: number
  avgClose: number
  recovery: number
  topInspector: string
}

export interface CasesWatchlistItem extends CaseRecord {
  overdueDays: number
  estValue: number
  urgency: number
  _synth: true
}

