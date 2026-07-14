import type {
  NoticeAiInsight,
  NoticeStats,
  NoticeTemplate,
  RecentNotice,
} from '../types'

/** Featured case reference (same case as Assessment module). */
export const FEATURED_CASE_ID = 'C-20260301-001'

/** Header meta — exact copy from the prototype. */
export const TEMPLATES_COUNT = 8
export const HISTORY_COUNT = 247

/** AI insight body (rendered in the shared AiInsightBanner). */
export const AI_INSIGHT: NoticeAiInsight = {
  title: 'AI notice assistant',
  caseId: FEATURED_CASE_ID,
  consumer: 'HEERA LAL AGRAWAL',
}

/** KPI values — exact numbers from the prototype (₹2.4 Cr = 24000000). */
export const NOTICE_STATS: NoticeStats = {
  draftsReady: 14,
  sentThisMonth: 247,
  paymentReceived: 182,
  paymentResponseRate: 73.7,
  underAppeal: 18,
  contestedRate: 7.3,
  amountBilledCr: 2.4,
}

/**
 * Full-text notice draft — verbatim from the prototype (renderNotices).
 * A single source; the language toggle in the UI shows this text for both
 * languages (matches the prototype, which also has no Hindi translation).
 */
export const NOTICE_SAMPLE = `UTTAR PRADESH POWER CORPORATION LIMITED
(A Govt. of Uttar Pradesh Undertaking)
Kashi Vidyut Vitaran Nigam Ltd. — Varanasi Zone

Notice No: UPPCL/VNS/TH/2026/042                    Date: 17 April 2026

To,
Shri HEERA LAL AGRAWAL
Consumer Account: 8115290000
Meter Number: 1849966
Address: L/C ORIENTAL BLDG, HAZRATGANJ, VARANASI

Subject: Notice under Section 135 of Electricity Act 2003 —
         Unauthorized use of electricity (Theft) — Assessment Order

Sir/Madam,

This is to inform you that upon technical inspection conducted on 17 April 2026 at your premises against Meter Number 1849966 (Account No. 8115290000), it has been detected that you have been engaged in unauthorized use of electricity by means of EARTH LOADING (bypass of meter neutral), thereby committing an offence under Section 135 of the Electricity Act, 2003.

Based on AI-powered detection and subsequent physical verification:
• 50 earth-loading tamper events recorded between 20 Nov 2022 and 01 Apr 2026
• Consumption dropped by 54% while connected load remained unchanged
• Peer consumer baseline: 19.2 kWh/day; your metered consumption during theft period: ~0 kWh/day
• Theft duration: 1,350 days

ASSESSMENT CALCULATION (Section 135 r/w UPERC Regulations):

    Stolen energy           = 1,350 days × 19.2 kWh/day  = 25,920 kWh
    Principal amount        = 25,920 kWh × ₹7.50/unit    = ₹1,94,400
    Penalty (Section 135.1A) = Principal × 2.0            = ₹3,88,800
    ─────────────────────────────────────────────────────────────
    TOTAL PAYABLE           = ₹3,88,800
    (Rupees Three Lakh Eighty-Eight Thousand Eight Hundred only)

YOU ARE HEREBY DIRECTED TO:

1. Deposit the assessed amount of ₹3,88,800 within THIRTY (30) DAYS from the
   date of this notice, failing which your supply shall be disconnected and
   legal proceedings initiated under Section 135 r/w Section 150 of the Act.

2. If you wish to contest this assessment, you may file an appeal before the
   Appellate Authority within 30 days as per Section 127 of the Act.

3. Payment may be made at any UPPCL counter, through BillDesk/PayU gateway,
   or in installments as per UPERC guidelines (max 6 installments).

Evidence package (6 items) is attached for your reference. Digital signature
hash: SHA-256:a8f3c1d4e7b2... (verifiable at uppcl.org/verify)

Executive Engineer
Electricity Urban Distribution Division, Bhelupur
Contact: 0542-XXXXXXX | vigilance@uppcl.org`

/** 8 notice templates — exact port of the prototype's array. */
export const NOTICE_TEMPLATES: NoticeTemplate[] = [
  { name: 'Section 135 Assessment Order', description: 'Standard theft assessment with penalty', usageCount: 189, language: 'EN+HI', color: 'var(--red)' },
  { name: 'Section 126 Unauthorized Use', description: 'Tariff category misuse cases', usageCount: 42, language: 'EN+HI', color: 'var(--amber)' },
  { name: 'Payment Reminder (30 day)', description: 'First reminder for unpaid assessments', usageCount: 68, language: 'EN+HI', color: 'var(--id-text, #0284c7)' },
  { name: 'Disconnection Warning', description: 'Final notice before disconnection', usageCount: 23, language: 'EN+HI', color: 'var(--red)' },
  { name: 'Appeal Acknowledgment', description: 'Confirms appeal received, next steps', usageCount: 18, language: 'EN+HI', color: 'var(--teal, #17a2b8)' },
  { name: 'Installment Agreement', description: 'Payment plan with 6 installments', usageCount: 34, language: 'EN+HI', color: 'var(--green)' },
  { name: 'Case Closure Letter', description: 'Theft paid or appeal successful', usageCount: 156, language: 'EN+HI', color: 'var(--green)' },
  { name: 'Inspection Notice (pre-visit)', description: '24 hrs advance notice of inspection', usageCount: 412, language: 'EN+HI', color: 'var(--id-text, #0284c7)' },
]

/** 5 recent notices — exact port of the prototype's table rows. */
export const RECENT_NOTICES: RecentNotice[] = [
  { id: 'UPPCL/VNS/TH/2026/041', consumer: 'BHUWAL JAISWAL',        type: 'Sec 135',   amount: 214600,  sentOn: '15 Apr 2026', delivery: '✓ SMS + Post', response: 'Paid' },
  { id: 'UPPCL/VNS/TH/2026/040', consumer: 'ANAND PRAKASH AGARWAL', type: 'Sec 126',   amount: 86400,   sentOn: '14 Apr 2026', delivery: '✓ Email',      response: 'Under appeal' },
  { id: 'UPPCL/VNS/TH/2026/039', consumer: 'ISHANT',                type: 'Sec 135',   amount: 142800,  sentOn: '12 Apr 2026', delivery: '✓ SMS',        response: 'Pending' },
  { id: 'UPPCL/VNS/TH/2026/038', consumer: 'M/S AGRAUTO',           type: 'PF Penalty',amount: 24800,   sentOn: '10 Apr 2026', delivery: '✓ Email',      response: 'Paid' },
  { id: 'UPPCL/VNS/DC/2026/003', consumer: 'RAMESH KUMAR',          type: 'Disconnect',amount: null,    sentOn: '08 Apr 2026', delivery: '✓ Physical',   response: 'Disconnected' },
]

/* ── Badge palettes (matches prototype .badge-* colors) ────────────────── */

export function typeBadgeStyle(type: RecentNotice['type']): { bg: string; color: string; border: string } {
  switch (type) {
    case 'Sec 135':
    case 'Disconnect':
      return { bg: 'rgba(220,53,69,0.10)', color: 'var(--red)', border: 'rgba(220,53,69,0.35)' }
    case 'Sec 126':
    case 'PF Penalty':
      return { bg: 'var(--amber-light, rgba(230,146,30,0.12))', color: 'var(--amber-dark, #92400e)', border: 'rgba(230,146,30,0.35)' }
  }
}

export function deliveryBadgeStyle(): { bg: string; color: string; border: string } {
  return { bg: 'rgba(40,167,69,0.10)', color: 'var(--green)', border: 'rgba(40,167,69,0.35)' }
}

export function responseBadgeStyle(r: RecentNotice['response']): { bg: string; color: string; border: string } {
  switch (r) {
    case 'Paid':
      return { bg: 'var(--ai-purple-light)', color: 'var(--ai-purple)', border: 'rgba(124,58,237,0.35)' }
    case 'Under appeal':
      return { bg: 'var(--ai-purple-light)', color: 'var(--ai-purple)', border: 'rgba(124,58,237,0.35)' }
    case 'Pending':
      return { bg: 'var(--amber-light, rgba(230,146,30,0.12))', color: 'var(--amber-dark, #92400e)', border: 'rgba(230,146,30,0.35)' }
    case 'Disconnected':
      return { bg: 'rgba(220,53,69,0.10)', color: 'var(--red)', border: 'rgba(220,53,69,0.35)' }
  }
}
