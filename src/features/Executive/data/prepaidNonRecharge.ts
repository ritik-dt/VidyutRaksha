import type { PrepaidNonRechargeData } from '../types'

export const PREPAID_NON_RECHARGE: PrepaidNonRechargeData = {
  totalText: '1,84,320',
  subtitle: 'consumers · Not recharged in 30+ days',
  trendPct: '▲ +12.4%',
  vsText: 'vs last month',
  buckets: [
    {
      label: '30 – 60 Days',
      consumersText: '82,410',
      sharePercent: 45,
      trendText: '▲ +8%',
      trend: 'worse',
      isEmphasis: false,
    },
    {
      label: '60 – 90 Days',
      consumersText: '56,780',
      sharePercent: 31,
      trendText: '▲ +15%',
      trend: 'worse',
      isEmphasis: false,
    },
    {
      label: '90+ Days',
      consumersText: '45,130',
      sharePercent: 24,
      trendText: '▲ +22%',
      trend: 'worse',
      isEmphasis: true,
    },
    {
      label: 'Never Recharged',
      consumersText: '3,210',
      sharePercent: 2,
      trendText: '⚠ New',
      trend: 'worse',
      isEmphasis: false,
      isSubtle: true,
    },
  ],
  alertText:
    '⚠ <strong>45,130 consumers silent &gt;90 days</strong> — likely inactive or illegally connected. Immediate field verification recommended. Est. revenue at risk: <strong>₹38 Cr/mo</strong>.',
  alertPanelKey: 'collection',
}
