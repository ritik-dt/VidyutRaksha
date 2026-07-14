export type NoticeLanguage = 'en' | 'hi'

export type NoticeTypeBadge = 'Sec 135' | 'Sec 126' | 'PF Penalty' | 'Disconnect'

export type DeliveryChannel = '✓ SMS + Post' | '✓ Email' | '✓ SMS' | '✓ Physical'

export type NoticeResponse = 'Paid' | 'Under appeal' | 'Pending' | 'Disconnected'

export interface RecentNotice {
  id: string
  consumer: string
  type: NoticeTypeBadge
  amount: number | null
  sentOn: string
  delivery: DeliveryChannel
  response: NoticeResponse
}

export interface NoticeTemplate {
  name: string
  description: string
  usageCount: number
  language: string
  color: string
}

export interface NoticesFilter {
  status?: 'sent'
}

export interface NoticeStats {
  draftsReady: number
  sentThisMonth: number
  paymentReceived: number
  paymentResponseRate: number
  underAppeal: number
  contestedRate: number
  amountBilledCr: number
}

export interface NoticeAiInsight {
  title: string
  caseId: string
  consumer: string
}
