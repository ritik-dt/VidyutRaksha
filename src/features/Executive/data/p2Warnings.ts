import type { P2Warning } from '../types'

/** 4 P2 warning cards shown at the bottom (follow-up items — not blocking). */
export const P2_WARNINGS: P2Warning[] = [
  {
    id: 'w1',
    eyebrow: '🟠 P2 Warning · Transformers',
    title: '28 Transformer Failures',
    detail: 'Agra Circle — emergency replacement + condition monitoring needed.',
    badge: '28 units this month',
    panelKey: 'saidi',
  },
  {
    id: 'w2',
    eyebrow: '🟠 P2 Warning · Metering',
    title: 'Tamper Alert Surge',
    detail: 'Bareilly — 186 alerts/day. FIR filing for confirmed cases.',
    badge: '186 alerts/day',
    panelKey: 'smart',
  },
  {
    id: 'w3',
    eyebrow: '🟠 P2 Warning · Smart Meters',
    title: 'Coverage Gap',
    detail: 'PuVVNL at 35% — project review required for Q2 target.',
    badge: '35% coverage',
    panelKey: 'smart',
  },
  {
    id: 'w4',
    eyebrow: '🟠 P2 Warning · Reliability',
    title: 'SAIFI Violation',
    detail: 'PVVNL/DVVNL at 6.2 vs target 4.0 — SCADA upgrade required.',
    badge: '6.2 vs 4.0 target',
    panelKey: 'saidi',
  },
]
