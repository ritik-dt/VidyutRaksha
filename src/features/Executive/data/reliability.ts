import type { ReliabilityPanelData } from '../types'

export const RELIABILITY: ReliabilityPanelData = {
  metrics: [
    {
      id: 'saidi',
      name: 'SAIDI',
      subtitle: 'Target <10 hr/yr',
      valueText: '12.2',
      unit: 'hr/yr',
      tone: 'warn',
      panelKey: 'saidi',
    },
    {
      id: 'saifi',
      name: 'SAIFI',
      subtitle: 'Target <30',
      valueText: '41.5',
      unit: 'interruptions',
      tone: 'bad',
      panelKey: 'saidi',
    },
    {
      id: 'outages',
      name: 'Outages Today',
      subtitle: 'All DISCOMs',
      valueText: '340',
      unit: 'incidents',
      tone: 'bad',
      panelKey: 'saidi',
    },
  ],
  transformerFailures: {
    totalText: '2,084',
    fleetText: '/ 4,82,000',
    percentText: '0.43%',
    belowKva: { label: 'Below 100 KVA', barPercent: 63, valueText: '1,140 (0.24%)' },
    aboveKva: { label: 'Above 100 KVA', barPercent: 37, valueText: '944 (0.20%)' },
    panelKey: 'saidi',
  },
}
