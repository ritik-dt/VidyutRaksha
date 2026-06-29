// ─── Theft Signatures (donut chart) — scope-aware, matches prototype's
//     deterministic hash-seeded distribution so each scope shows different %s ──
export interface TheftSignature {
  name: string
  value: number
  color: string
}

const THEFT_SIGNATURE_COLORS: Record<string, string> = {
  'Earth Loading': '#DC3545',
  'Meter Bypass': '#E6921E',
  'CT Manipulation': '#7C3AED',
  'Magnetic Tamper': '#0EA5E9',
  'Tariff Misuse': '#28A745',
  'Direct Hooking': '#D97706',
}

export function getTheftSignatureData(scopeId: string): TheftSignature[] {
  let h = 0
  for (let i = 0; i < scopeId.length; i++) h = (h * 31 + scopeId.charCodeAt(i)) | 0
  const seed = Math.abs(h)

  const dist = [
    { name: 'Earth Loading', val: 32 + (seed % 11) },
    { name: 'Meter Bypass', val: 22 + ((seed >> 3) % 8) },
    { name: 'CT Manipulation', val: 14 + ((seed >> 5) % 6) },
    { name: 'Magnetic Tamper', val: 11 + ((seed >> 7) % 5) },
    { name: 'Tariff Misuse', val: 8 + ((seed >> 9) % 4) },
    { name: 'Direct Hooking', val: 5 + ((seed >> 11) % 3) },
  ]
  const total = dist.reduce((s, d) => s + d.val, 0)

  return dist.map((d) => ({
    name: d.name,
    value: Math.round((d.val * 100) / total),
    color: THEFT_SIGNATURE_COLORS[d.name],
  }))
}

const THEFT_SIGNATURE_INSIGHTS: Record<string, (pct: number) => string> = {
  'Earth Loading': (pct) =>
    `**Earth Loading** dominates this scope (${pct}% of flags) — points to physical bypass on industrial/commercial connections. Recommend prioritizing CT clamp inspections.`,
  'Meter Bypass': (pct) =>
    `**Meter Bypass** is the leading pattern (${pct}%) — direct service-line tampering. Field inspections need lockout protocols and photo evidence.`,
  'CT Manipulation': (pct) =>
    `**CT Manipulation** leads at ${pct}% — sophisticated commercial-tier theft. Requires CT-meter ratio verification and seal audits.`,
  'Magnetic Tamper': (pct) =>
    `**Magnetic Tampering** dominates (${pct}%) — typical of domestic consumers. Consider replacing affected meter models with magnet-resistant variants.`,
  'Tariff Misuse': (pct) =>
    `**Tariff Misuse** tops the chart (${pct}%) — consumers running commercial loads on domestic tariff. Recommend load-pattern + KYC audit.`,
  'Direct Hooking': (pct) =>
    `**Direct Hooking** leads (${pct}%) — pre-meter service-line theft. Coordinate with line-patrol team for visual inspection.`,
}

export function getTheftSignatureInsight(dist: TheftSignature[]): string {
  const top = dist.slice().sort((a, b) => b.value - a.value)[0]
  const fn = THEFT_SIGNATURE_INSIGHTS[top.name]
  return fn ? fn(top.value) : `**${top.name}** is the top signature (${top.value}%).`
}

// ─── Detection Trend (12-month line chart) — scope-aware, scaled off the
//     scope's flagged count so smaller scopes show proportionally smaller series ──
export interface DetectionTrendPoint {
  month: string
  newFlags: number
  confirmed: number
}

const DETECTION_TREND_MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

export function getDetectionTrendData(flagged: number | undefined): DetectionTrendPoint[] {
  const baseFlagged = flagged ? Math.round(flagged / 12) : 3375
  return DETECTION_TREND_MONTHS.map((month, i) => {
    const newFlags = Math.round(baseFlagged * (0.85 + 0.04 * i + Math.sin(i * 1.3) * 0.06))
    return { month, newFlags, confirmed: Math.round(newFlags * 0.575) }
  })
}

// ─── Risk Trend (12-month line for meter detail) ─────────────────────────────
export function getRiskTrendData(meterId: string) {
  const base = ['884759', '1849966'].includes(meterId)
    ? [18, 16, 14, 18, 20, 22, 38, 56, 70, 78, 85, 90]
    : [15, 18, 16, 20, 22, 24, 35, 48, 62, 72, 80, 88]
  return ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => ({
    month: m, risk: base[i], threshold: 70,
  }))
}

// ─── Risk drivers breakdown ───────────────────────────────────────────────────
export function getRiskDriversData(meterId: string) {
  if (meterId === '884759') {
    return [
      { signal: 'Lifetime tamper events', pct: 33 },
      { signal: 'Zero-load anomaly',       pct: 29 },
      { signal: 'Power-factor degradation',pct: 16 },
      { signal: 'CT manipulation pattern', pct: 14 },
      { signal: 'Sanctioned-load mismatch',pct: 4  },
      { signal: 'Activity-tariff mismatch',pct: 3  },
    ]
  }
  return [
    { signal: 'Consumption drop', pct: 38 },
    { signal: 'Earth loading',    pct: 28 },
    { signal: 'Peer anomaly',     pct: 18 },
    { signal: 'Load factor',      pct: 10 },
    { signal: 'kWh-MD divergence',pct: 4  },
    { signal: 'Night pattern',    pct: 2  },
  ]
}

// ─── Consumer timeline ────────────────────────────────────────────────────────
export function getConsumerTimeline() {
  return [
    { date: '15 Oct 2025', label: 'Baseline period',          desc: 'Normal consumption ~900 kWh/month, risk 22',                                    color: 'var(--green)',      dot: 'green'  },
    { date: '12 Nov 2025', label: 'First anomaly detected',   desc: 'kWh drop of 15% vs peer group average — risk 38',                              color: 'var(--amber)',      dot: 'amber'  },
    { date: '28 Nov 2025', label: 'Earth loading event #1',   desc: 'Event code 69 — first tamper event logged',                                     color: 'var(--red)',        dot: 'red'    },
    { date: '04 Dec 2025', label: 'Risk threshold crossed',   desc: 'AI risk score exceeded 70 — meter added to suspicious list',                    color: 'var(--red)',        dot: 'red'    },
    { date: '15 Jan 2026', label: 'Cluster pattern detected', desc: 'AI identified 3 other consumers under same DTR with similar pattern',            color: 'var(--ai-purple)', dot: 'purple' },
    { date: '01 Feb 2026', label: 'Demand stability verified','desc': 'Max Demand unchanged while kWh dropped 54% — kWh-MD divergence rule triggered', color: 'var(--red)',      dot: 'red'    },
    { date: '05 Mar 2026', label: 'Case created',             desc: 'Assigned to Rajesh Kumar for field inspection',                                  color: '#0EA5E9',           dot: 'blue'   },
  ]
}

// ─── Similar consumers under same DTR (AI-detected cluster) ─────────────────
export interface ClusterConsumer {
  name: string
  meter: string
  similarity: number
  drop: number
  tamperEvents: number
  risk: number
  status: 'New' | 'In Progress'
}

export interface ClusterData {
  dtrName: string
  consumers: ClusterConsumer[]
}

// Only meter 1849966 has a confirmed coordinated-theft cluster, matching the prototype
const SIMILAR_CONSUMERS_CLUSTER: Record<string, ClusterData> = {
  '1849966': {
    dtrName: 'DTR Vijaya Complex',
    consumers: [
      { name: 'BHUWAL JAISWAL', meter: 'SC10178896', similarity: 94, drop: -47, tamperEvents: 12, risk: 78, status: 'In Progress' },
      { name: 'ANAND PRAKASH AGARWAL', meter: 'AL2861165', similarity: 76, drop: -38, tamperEvents: 5, risk: 65, status: 'New' },
      { name: 'ISHANT', meter: 'AL2860041', similarity: 72, drop: -41, tamperEvents: 18, risk: 72, status: 'New' },
    ],
  },
}

export function getSimilarConsumersCluster(meterId: string): ClusterData | null {
  return SIMILAR_CONSUMERS_CLUSTER[meterId] ?? null
}

// ─── Daily consumption data ───────────────────────────────────────────────────
export interface DailyConsumptionPoint {
  day: string
  meter: number
  peer: number
}

// Mirrors the prototype's fixed `dailyProfile` object exactly (labels/kwh/peerAvg)
export function getDailyConsumptionData(): DailyConsumptionPoint[] {
  const labels = [
    '1 Feb', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '1 Mar', '2', '3',
  ]
  const kwh = [
    18.2, 17.8, 19.1, 18.5, 17.2, 16.8, 15.4, 14.9, 15.2, 14.1, 13.8, 14.5, 13.2, 12.8, 13.1, 12.4, 11.9, 12.2, 11.5, 10.8, 11.2, 10.5, 9.8, 10.2, 9.5, 8.8, 9.2, 8.5, 7.8, 6.2, 0.2,
  ]
  const peerAvg = [
    19.5, 19.2, 19.8, 19.4, 19.1, 18.8, 19.5, 19.2, 18.9, 19.4, 19.1, 18.7, 19.3, 19.0, 18.8, 19.2, 18.9, 19.1, 18.8, 19.4, 19.0, 18.7, 19.2, 18.9, 19.1, 18.8, 19.3, 19.0, 18.7, 19.1, 18.9,
  ]
  return labels.map((day, i) => ({ day, meter: kwh[i], peer: peerAvg[i] }))
}

// ─── Billing history ──────────────────────────────────────────────────────────
export interface BillingHistoryPoint {
  month: string
  kwh: number
  md: number
}

// Mirrors the prototype's fixed `billingData` + `demandData` objects exactly
export function getBillingHistoryData(): BillingHistoryPoint[] {
  const labels = ["Apr'25", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan'26", 'Feb']
  const kwh = [618, 917, 944, 868, 567, 579, 572, 417, 416, 396, 434]
  const md = [3.8, 6.2, 6.56, 5.9, 4.1, 4.2, 4.0, 3.2, 3.1, 2.9, 3.0]
  return labels.map((month, i) => ({ month, kwh: kwh[i], md: md[i] }))
}

export interface LoadFactorPoint {
  month: string
  lf: number
}

export function getLoadFactorData(): LoadFactorPoint[] {
  const labels = ["Apr'25", 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', "Jan'26", 'Feb']
  const lf = [0.23, 0.21, 0.2, 0.21, 0.19, 0.19, 0.2, 0.18, 0.19, 0.19, 0.2]
  return labels.map((month, i) => ({ month, lf: lf[i] }))
}

// ─── Load profile (30-min intervals) ─────────────────────────────────────────
export interface LoadProfilePoint {
  time: string
  kwh: number
  demand: number
}

// Mirrors the prototype's fixed `loadSurvey` object exactly (labels/values/demandKw)
export function getLoadProfileData(): LoadProfilePoint[] {
  const labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
  const values = [0.12, 0.1, 0.08, 0.32, 0.65, 1.12, 1.45, 1.15, 0.85, 0.95, 1.35, 0.65]
  const demandKw = [0.24, 0.2, 0.16, 0.64, 1.3, 2.24, 2.9, 2.3, 1.7, 1.9, 2.7, 1.3]
  return labels.map((time, i) => ({ time, kwh: values[i], demand: demandKw[i] }))
}

// ─── Last 7 days bar (real meters) ───────────────────────────────────────────
export function getLast7Data(meterId: string) {
  if (meterId === '884759') return [
    { d: '02-Mar', kwh: 0.0 }, { d: '03-Mar', kwh: 14.2 }, { d: '04-Mar', kwh: 6.8 },
    { d: '05-Mar', kwh: 1.1 }, { d: '06-Mar', kwh: 0.0  }, { d: '07-Mar', kwh: 18.4 },
    { d: '08-Mar', kwh: 31.2 },
  ]
  return [
    { d: 'Mon', kwh: 42.1 }, { d: 'Tue', kwh: 38.4 }, { d: 'Wed', kwh: 44.2 },
    { d: 'Thu', kwh: 0.0  }, { d: 'Fri', kwh: 8.2  }, { d: 'Sat', kwh: 28.6 },
    { d: 'Sun', kwh: 22.1 },
  ]
}
