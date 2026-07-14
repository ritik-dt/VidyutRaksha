/**
 * Consumer master data — API-ready.
 * The demo data below is what the prototype hard-codes into `renderConsumer()`.
 * When the backend `GET /api/consumers/:id` endpoint is available, replace the
 * body of `getConsumerById()` in `useConsumer.ts` with an actual fetch — no
 * component changes required.
 */

export type ConsumerRiskLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type MeterStatus = 'Theft confirmed' | 'Normal' | 'Under review' | 'Escalated'
export type CaseStatus = 'Active' | 'Resolved' | 'Under review' | 'Escalated'

export interface ConsumerMeter {
  id: string
  location: string
  sanctioned: string
  lastReading: string
  risk: number
  status: MeterStatus
  detailPath?: string
}

export interface ConsumerCase {
  id: string
  status: CaseStatus
  section: string
  amount: string
  assignedTo?: string
  dueDate?: string
  resolvedNote?: string
}

export interface ConsumerCommunication {
  kind: 'email' | 'sms' | 'call' | 'response'
  icon: string
  title: string
  meta: string
}

export interface ConsumerNote {
  officer: string
  role: string
  date: string
  body: string
}

export interface PaymentMonth {
  label: string
  daysLate: number
}

export interface Consumer {
  id: string
  name: string
  accountNumber: string
  since: number
  category: string
  sanctionedLoad: string
  tariff: string
  address: {
    line1: string
    cityPin: string
  }
  phone: string
  phoneVerified: boolean
  email: string
  gstin: string
  dtr: string
  risk: {
    score: number
    level: ConsumerRiskLevel
  }
  activeMeters: number
  activeCases: number
  paymentScore: number
  paymentScorePrevious: number
  paymentSeries: PaymentMonth[]
  paymentAnomaly?: string
  aiProfile: string
  meters: ConsumerMeter[]
  cases: ConsumerCase[]
  communications: ConsumerCommunication[]
  notes: ConsumerNote[]
}

/**
 * Byte-identical port of the prototype's demo consumer template.
 * The prototype's `renderConsumer(consumerId)` always renders this same data
 * regardless of the id — this is the reference profile the AI insights are based on.
 */
const HEERA_LAL_AGRAWAL: Consumer = {
  id: 'K-000000',
  name: 'HEERA LAL AGRAWAL',
  accountNumber: '8115290000',
  since: 2017,
  category: 'LMV2 - Commercial (Non-domestic)',
  sanctionedLoad: '35 kW (MF=2.0)',
  tariff: '₹7.50/unit + fixed charge',
  address: {
    line1: 'L/C ORIENTAL BLDG,',
    cityPin: 'HAZRATGANJ, VARANASI - 221001',
  },
  phone: '+91 98XXX-XX123',
  phoneVerified: true,
  email: 'heera.agrawal@xxx.com',
  gstin: '09AAFCH1234L1Z5',
  dtr: 'Vijaya Complex (Kothi) — Bhelupur Feeder',
  risk: { score: 88, level: 'HIGH' },
  activeMeters: 2,
  activeCases: 1,
  paymentScore: 72,
  paymentScorePrevious: 95,
  // 24-month payment history from prototype — [2,1,3,2,4,1,2,3,1,2,4,3,2,1,3,2,4,2,1,3,22,18,25,20]
  paymentSeries: [
    { label: 'Apr24', daysLate: 2 },
    { label: 'May',   daysLate: 1 },
    { label: 'Jun',   daysLate: 3 },
    { label: 'Jul',   daysLate: 2 },
    { label: 'Aug',   daysLate: 4 },
    { label: 'Sep',   daysLate: 1 },
    { label: 'Oct',   daysLate: 2 },
    { label: 'Nov',   daysLate: 3 },
    { label: 'Dec',   daysLate: 1 },
    { label: 'Jan25', daysLate: 2 },
    { label: 'Feb',   daysLate: 4 },
    { label: 'Mar',   daysLate: 3 },
    { label: 'Apr',   daysLate: 2 },
    { label: 'May',   daysLate: 1 },
    { label: 'Jun',   daysLate: 3 },
    { label: 'Jul',   daysLate: 2 },
    { label: 'Aug',   daysLate: 4 },
    { label: 'Sep',   daysLate: 2 },
    { label: 'Oct',   daysLate: 1 },
    { label: 'Nov',   daysLate: 3 },
    { label: 'Dec',   daysLate: 22 },
    { label: 'Jan26', daysLate: 18 },
    { label: 'Feb',   daysLate: 25 },
    { label: 'Mar',   daysLate: 20 },
  ],
  paymentAnomaly:
    'Payment behavior changed from consistent on-time to delayed starting Nov 2025 — coincides with theft detection window.',
  aiProfile:
    '{name} is a commercial consumer (LMV2) operating from L/C ORIENTAL BLDG, HAZRATGANJ, VARANASI. Has 2 active meters under this account. Red flag indicators: meter #1849966 shows 50 earth loading events and −54% consumption drop. Payment history: consistent on-time for 7 years, then delayed payments started Nov 2025 — correlates with theft start. Risk profile: HIGH (88/100).',
  meters: [
    {
      id: '1849966',
      location: 'Main showroom',
      sanctioned: '35 kW',
      lastReading: '04 Apr 2026 · 0 kWh',
      risk: 88,
      status: 'Theft confirmed',
      detailPath: '/meters/1849966',
    },
    {
      id: 'AL1705463',
      location: 'Godown',
      sanctioned: '10 kW',
      lastReading: '04 Apr 2026 · 412 kWh',
      risk: 22,
      status: 'Normal',
      detailPath: '/meters/AL1705463',
    },
  ],
  cases: [
    {
      id: 'C-20260301-001',
      status: 'Active',
      section: 'Section 135 · Earth loading',
      amount: '₹3,88,800',
      assignedTo: 'Rajesh Kumar',
      dueDate: '15 Apr',
    },
    {
      id: 'C-20230812-008',
      status: 'Resolved',
      section: 'False alarm · Billing system error',
      amount: '2023',
    },
  ],
  communications: [
    {
      kind: 'email',
      icon: '✉',
      title: 'Section 135 Assessment Notice',
      meta: 'Email + Post · 05 Mar 2026 · Delivered',
    },
    {
      kind: 'sms',
      icon: '📱',
      title: 'Inspection pre-visit SMS',
      meta: 'SMS · 01 Apr 2026 · Read',
    },
    {
      kind: 'call',
      icon: '📞',
      title: 'Phone call logged by inspector',
      meta: 'Inspector Rajesh K · 02 Apr 2026 · 4:30 min',
    },
    {
      kind: 'response',
      icon: '✉',
      title: 'Consumer response received',
      meta: 'Email · 08 Apr 2026 · "Will pay in installments"',
    },
  ],
  notes: [
    {
      officer: 'Rajesh Kumar',
      role: 'Inspector',
      date: '05 Apr 2026',
      body:
        'Consumer was cooperative during visit. Requested installment payment plan. Running showroom for 15+ years, no prior issues. Recommend 6-installment plan approval.',
    },
    {
      officer: 'Rajiv Mehta',
      role: 'Vigilance Officer',
      date: '03 Apr 2026',
      body:
        'Brother-in-law of consumer is Councilor. Handle with standard protocol, document everything carefully.',
    },
  ],
}

/**
 * Return a consumer by id.
 *
 * The prototype's demo template renders the same reference profile for every id;
 * this port does the same, but personalizes the `name` field from the URL query
 * string so the page shows the name of the consumer the user actually clicked.
 *
 * When the backend is wired, replace this function body with:
 *     const res = await fetch(`/api/consumers/${id}`)
 *     return res.json()
 */
export function getConsumerById(id: string, displayName?: string): Consumer {
  const base = HEERA_LAL_AGRAWAL
  if (!displayName) return { ...base, id }
  return {
    ...base,
    id,
    name: displayName,
    aiProfile: base.aiProfile.replace('{name}', displayName),
  }
}
