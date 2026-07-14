import type { CriticalAlert } from '../types'

/** 4 P1 critical-alert cards shown above the KPI strip. */
export const CRITICAL_ALERTS: CriticalAlert[] = [
  {
    id: 'a1',
    eyebrow: '🔴 P1 Critical · AT&C Loss',
    title: 'High Loss Feeders',
    detail: 'Kanpur, Agra, Lucknow — AT&C exceeding 45%. Meter tampering suspected.',
    impact: '₹18.5 Cr/mo risk',
    actionLabel: 'Initiate Drive',
    actionToast: 'Anti-theft drive initiated',
    panelKey: 'alert1',
    cardToast: 'Escalating: Kanpur AT&C inspection initiated',
  },
  {
    id: 'a2',
    eyebrow: '🔴 P1 Critical · Outage',
    title: 'Major Substation Outage',
    detail: '4 sub-stations down · Varanasi critical. 1.2L consumers affected.',
    impact: '1.2 Lakh consumers',
    actionLabel: 'Escalate CE',
    actionToast: 'PuVVNL CE alerted',
    panelKey: 'alert2',
    cardToast: 'Emergency team deployed to Varanasi',
  },
  {
    id: 'a3',
    eyebrow: '🔴 P1 Critical · Supply',
    title: 'Peak Shortage Alert',
    detail: '700 MW deficit at 7 PM today. Emergency procurement + load shedding needed.',
    impact: '700 MW deficit',
    actionLabel: 'Alert Procurement',
    actionToast: 'Procurement alerted',
    panelKey: 'alert3',
    cardToast: 'Procurement team alerted for 700 MW',
  },
  {
    id: 'a4',
    eyebrow: '🔴 P1 Critical · Revenue',
    title: 'Collection Drop',
    detail: 'DVVNL at 82%. ₹482 Cr gap this month. Disconnection notices required.',
    impact: '₹482 Cr gap',
    actionLabel: 'Issue Notice',
    actionToast: 'Disconnection notices issued',
    panelKey: 'alert4',
    cardToast: 'Collection notice dispatched to DVVNL',
  },
]
