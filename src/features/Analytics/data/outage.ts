/** Outage cause breakup chart — exact port from prototype's initOutageCharts. */
export const OUTAGE_CAUSE_DATA = {
  labels: ['Feeder (planned)', 'Feeder (fault)', 'DTR-level', 'Consumer-only'],
  values: [42, 26, 18, 14],
  colors: ['#1B4F72', '#E6921E', '#17A2B8', '#DC3545'],
}

/** Outage by duration chart — exact port. */
export const OUTAGE_DURATION_DATA = {
  labels: ['<5 min', '5-60 min', '1-8 hrs', '>8 hrs'],
  values: [342, 186, 94, 28],
  colors: ['#28A745', '#17A2B8', '#E6921E', '#DC3545'],
}

/** Badge style keys per prototype's badge classes. */
export type OutageBadgeVariant = 'confirmed' | 'assigned'

export interface SuspiciousOutageRow {
  consumer: string
  dtr: string
  offHours: number
  offHoursColor: 'red' | 'amber'
  dtrLive: boolean
  pattern: string
  patternBadge: OutageBadgeVariant
  risk: number
}

/** Suspicious consumer-level outage patterns — exact port of the 4 rows in prototype. */
export const SUSPICIOUS_OUTAGES: SuspiciousOutageRow[] = [
  { consumer: 'HEERA LAL AGRAWAL',    dtr: 'Vijaya Complex', offHours: 42, offHoursColor: 'red',   dtrLive: true, pattern: 'Night disconnect', patternBadge: 'confirmed', risk: 92 },
  { consumer: 'BHUWAL JAISWAL',        dtr: 'Vijaya Complex', offHours: 38, offHoursColor: 'red',   dtrLive: true, pattern: 'Night disconnect', patternBadge: 'confirmed', risk: 86 },
  { consumer: 'ANAND PRAKASH AGARWAL', dtr: 'Vijaya Complex', offHours: 28, offHoursColor: 'amber', dtrLive: true, pattern: 'Sync with above',  patternBadge: 'assigned',  risk: 72 },
  { consumer: 'RAMESH KUMAR',          dtr: 'Shivpur Colony', offHours: 24, offHoursColor: 'amber', dtrLive: true, pattern: 'Weekend pattern', patternBadge: 'confirmed', risk: 68 },
]

/** 4 KPI values used in the Outage tab strip — hardcoded in the prototype. */
export const OUTAGE_KPIS = {
  feederPct: 68,
  dtrPct: 18,
  consumerOnlyPct: 14,
  suspiciousPct: 2.3,
}
