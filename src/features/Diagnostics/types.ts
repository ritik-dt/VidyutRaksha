export type DiagnosticPriority = 'high' | 'medium'
export type DiagnosticSeverity = 'critical' | 'high' | 'medium'

export interface DiagnosticReportDefinition {
  id: string
  priority: DiagnosticPriority
  severity: DiagnosticSeverity
  icon: string
  title: string
  sub: string
  count: number
  delta: number
  insight: string
  physics: string
  revenueImpact: number
  typicalMeters: string
}

export interface DiagnosticReport extends DiagnosticReportDefinition {
  originalCount: number
  scopeShare: number
}

export interface DiagnosticScopeAdjustment {
  count: number
  revenueImpact: number
  scopeShare: number
}

export interface DiagnosticAffectedMeter {
  id: string
  consumer: string
  location: string
  zone: string
  detected: string
  evidence: string
  flag: string
  estimatedLoss: number
  tariff: string
  activity: string
  real?: boolean
}
