export type AppealStatus =
  | 'Under review'
  | 'Hearing scheduled'
  | 'Upheld (reduced)'
  | 'Dismissed'

export type AppealPriority = 'High' | 'Medium' | 'Low' | 'Resolved'

export type AppealFilterId = 'all' | 'active' | 'scheduled'

export interface Appeal {
  id: string
  case: string
  consumer: string
  amount: string
  filed: string
  status: AppealStatus
  reviewer: string
  hearing: string
  grounds: string
  priority: AppealPriority
  outcome?: string
}

export interface AppealsFilter {
  status?: 'Active' | 'Scheduled'
}

export interface AppealsStats {
  activeAppeals: number
  disputedAmountFmt: string
  hearingThisWeek: number
  resolvedMtd: number
  upheldRatePct: number
  avgResolutionDays: number
}

export interface HearingPrepBox {
  title: 'Consumer\'s claim' | 'AI counter-argument' | 'Recommended outcome'
  color: string
  bodyHtml: string
}
