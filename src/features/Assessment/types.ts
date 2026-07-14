export type PenaltyMultiplier = '2.0' | '1.5' | '3.0'

export type ConsumerCategory = 'LMV2' | 'LMV1' | 'LMV6'

export interface AssessmentInputs {
  consumer: string
  account: string
  category: ConsumerCategory
  tariffRate: number
  theftStartDate: string
  detectionDate: string
  peerAvgKwhPerDay: number
  penaltyMultiplier: PenaltyMultiplier
  theftMethod: string
}

export interface AssessmentBreakdown {
  days: number
  stolenKwh: number
  meteredKwh: number
  principal: number
  penaltyMultiplier: number
  total: number
}

export interface AssessmentMethod {
  id: 'peer' | 'historical' | 'connected'
  name: string
  description: string
  stolenKwh: number
  principal: number
  withPenalty: number
  confidence: number
  recommended?: boolean
}

export interface EvidenceItem {
  n: string
  icon: string
  title: string
  description: string
}
