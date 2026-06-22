// ─── Theft Signatures (donut chart) ──────────────────────────────────────────
export const THEFT_SIGNATURE_DATA = [
  { name: 'Earth Loading',     value: 33, color: '#DC3545' },
  { name: 'Meter Bypass',      value: 21, color: '#E6921E' },
  { name: 'CT Manipulation',   value: 18, color: '#7C3AED' },
  { name: 'Magnetic Tamper',   value: 15, color: '#3B82F6' },
  { name: 'Tariff Misuse',     value: 8,  color: '#10B981' },
  { name: 'Direct Hooking',    value: 5,  color: '#1F2937' },
]

// ─── Detection Trend (12-month line chart) ───────────────────────────────────
export const DETECTION_TREND_DATA = [
  { month: 'May',  newFlags: 1800, confirmed: 1950 },
  { month: 'Jun',  newFlags: 2100, confirmed: 2050 },
  { month: 'Jul',  newFlags: 2400, confirmed: 2150 },
  { month: 'Aug',  newFlags: 2600, confirmed: 2200 },
  { month: 'Sep',  newFlags: 2800, confirmed: 2250 },
  { month: 'Oct',  newFlags: 3000, confirmed: 2300 },
  { month: 'Nov',  newFlags: 3100, confirmed: 2350 },
  { month: 'Dec',  newFlags: 3200, confirmed: 2350 },
  { month: 'Jan',  newFlags: 3500, confirmed: 2400 },
  { month: 'Feb',  newFlags: 3800, confirmed: 2450 },
  { month: 'Mar',  newFlags: 4200, confirmed: 2500 },
  { month: 'Apr',  newFlags: 4500, confirmed: 2550 },
]

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

// ─── Daily consumption data ───────────────────────────────────────────────────
export function getDailyConsumptionData() {
  const data = []
  const startVal = 18.5
  const peerAvg = 19.2
  for (let i = 0; i < 32; i++) {
    const label = i < 28 ? `${i + 1} Feb` : `${i - 27} Mar`
    const decline = Math.max(0, startVal - i * 0.52 + (Math.sin(i) * 0.4))
    data.push({ day: label, meter: parseFloat(decline.toFixed(1)), peer: parseFloat((peerAvg + Math.sin(i * 0.3) * 0.3).toFixed(1)) })
  }
  return data
}

// ─── Billing history ──────────────────────────────────────────────────────────
export function getBillingHistoryData() {
  return [
    { month: "Apr'25", kwh: 580, md: 5.8 }, { month: "May'25", kwh: 850, md: 6.2 },
    { month: "Jun'25", kwh: 944, md: 6.56 }, { month: "Jul'25", kwh: 910, md: 6.4 },
    { month: "Aug'25", kwh: 780, md: 5.9 }, { month: "Sep'25", kwh: 720, md: 5.6 },
    { month: "Oct'25", kwh: 620, md: 5.1 }, { month: "Nov'25", kwh: 530, md: 4.5 },
    { month: "Dec'25", kwh: 490, md: 4.2 }, { month: "Jan'26", kwh: 478, md: 3.8 },
    { month: "Feb'26", kwh: 434, md: 3.0 },
  ]
}

export function getLoadFactorData() {
  return [
    { month: "Apr'25", lf: 0.22 }, { month: "May'25", lf: 0.19 }, { month: "Jun'25", lf: 0.20 },
    { month: "Jul'25", lf: 0.20 }, { month: "Aug'25", lf: 0.18 }, { month: "Sep'25", lf: 0.18 },
    { month: "Oct'25", lf: 0.17 }, { month: "Nov'25", lf: 0.16 }, { month: "Dec'25", lf: 0.16 },
    { month: "Jan'26", lf: 0.17 }, { month: "Feb'26", lf: 0.20 },
  ]
}

// ─── Load profile (30-min intervals) ─────────────────────────────────────────
export function getLoadProfileData() {
  const data = []
  for (let h = 0; h <= 22; h += 0.5) {
    const hh = Math.floor(h), mm = h % 1 === 0.5 ? '30' : '00'
    const label = `${hh < 10 ? '0' : ''}${hh}:${mm}`
    const isNight = hh < 5, isMorning = hh >= 6 && hh <= 9
    const isPeak = hh >= 10 && hh <= 16, isEvening = hh >= 17 && hh <= 21
    const kwh = isNight ? 0.1 + Math.random() * 0.1
      : isMorning ? 0.4 + Math.random() * 0.3
      : isPeak ? 1.1 + Math.random() * 0.3
      : isEvening ? 0.9 + Math.random() * 0.3
      : 0.2 + Math.random() * 0.1
    data.push({ time: label, kwh: parseFloat(kwh.toFixed(2)), demand: parseFloat((kwh * 2).toFixed(2)) })
  }
  return data
}

// ─── Tamper events ────────────────────────────────────────────────────────────
export function getTamperYearlyData(meterId: string) {
  if (meterId === '884759') {
    return [
      { year: '2021', critical: 0, high: 0,   medium: 5  },
      { year: '2022', critical: 0, high: 14,  medium: 8  },
      { year: '2023', critical: 0, high: 98,  medium: 12 },
      { year: '2024', critical: 0, high: 26,  medium: 10 },
      { year: '2025', critical: 0, high: 28,  medium: 12 },
      { year: '2026', critical: 0, high: 250, medium: 42 },
    ]
  }
  return [
    { year: '2021', critical: 2,   high: 4,  medium: 6  },
    { year: '2022', critical: 50,  high: 12, medium: 8  },
    { year: '2023', critical: 18,  high: 8,  medium: 6  },
    { year: '2024', critical: 12,  high: 6,  medium: 4  },
    { year: '2025', critical: 8,   high: 6,  medium: 4  },
    { year: '2026', critical: 350, high: 12, medium: 14 },
  ]
}

export function getTamperBreakdown(meterId: string) {
  if (meterId === '884759') return { earth: 0, pf: 100, neutral: 20, magnet: 0, cover: 0, other: 301 }
  return { earth: 389, pf: 12, neutral: 8, magnet: 4, cover: 3, other: 32 }
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
