import type { Insight } from '../types'

/** Auto-detected insights shown in the right-hand column. Body text may contain
 *  simple <strong> markup — rendered as HTML by the InsightItem component. */
export const AUTO_INSIGHTS: Insight[] = [
  {
    id: 'i1',
    icon: '⚠️',
    tag: 'CRITICAL',
    tagVariant: 'critical',
    bodyHtml: 'AT&C Loss increased by <strong>+2%</strong> in Kanpur zone over last 7 days. Possible meter tampering detected.',
    meta: '2 hours ago · Auto-detected',
    panelKey: 'atc',
  },
  {
    id: 'i2',
    icon: '🌡️',
    tag: 'WARNING',
    tagVariant: 'warning',
    bodyHtml: 'Peak shortage of <strong>560+ MW</strong> expected tomorrow at 7 PM due to seasonal demand surge.',
    meta: 'Forecast · AI Model',
    panelKey: 'peak',
  },
  {
    id: 'i3',
    icon: '💸',
    tag: 'REVENUE',
    tagVariant: 'critical',
    bodyHtml: 'DVVNL collection efficiency dropped to <strong>82%</strong>. Outstanding dues increased by ₹340 Cr this month.',
    meta: '4 hours ago · Billing system',
    panelKey: 'alert4',
  },
  {
    id: 'i4',
    icon: '📡',
    tag: 'INFO',
    tagVariant: 'info',
    bodyHtml: 'Smart meter rollout on track in Lucknow urban — 68% coverage achieved, target 75% by June.',
    meta: 'Today 09:00 · PVVNL',
    panelKey: 'smart',
  },
  {
    id: 'i5',
    icon: '🔧',
    tag: 'RELIABILITY',
    tagVariant: 'warning',
    bodyHtml: '174 transformer failures this month — <strong>28% above</strong> seasonal average. Agra circle worst hit.',
    meta: 'Updated 1 hour ago',
    panelKey: 'saidi',
  },
]
