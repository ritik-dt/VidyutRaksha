import type { DemandGenerationData } from '../types'

/** Demand vs Generation comparison card. */
export const DEMAND_GENERATION: DemandGenerationData = {
  balanceText: '−560 MW',
  rows: [
    {
      label: 'Demand',
      valueText: '18,420 MW',
      numericText: '18,420',
      percent: 100,
      gradient: 'crimson',
      panelKey: 'peak',
    },
    {
      label: 'Generation',
      valueText: '17,860 MW',
      numericText: '17,860',
      percent: 96.9,
      gradient: 'jade',
      panelKey: 'supply',
    },
    {
      label: 'After DRE',
      valueText: 'Renewables',
      numericText: '3,680',
      percent: 78,
      gradient: 'brand',
      panelKey: 'supply',
    },
  ],
  deficitAlert: {
    text: '⚠ Deficit — Load Shedding Required',
    valueText: '560 MW',
    panelKey: 'alert3',
  },
  summary: [
    { valueText: '96.9%', label: 'D/G Ratio', tone: 'jade', panelKey: 'supply' },
    { valueText: '0.5 hr', label: 'Urban Shedding', tone: 'jade', panelKey: 'peak' },
    { valueText: '5.8 hr', label: 'Rural Shedding', tone: 'amber', panelKey: 'peak' },
  ],
}
