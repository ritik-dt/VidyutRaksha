import type { EnergyFlowData } from '../types'

/** Energy flow funnel (Input → Billed → Collected → Loss). */
export const ENERGY_FLOW: EnergyFlowData = {
  input: { valueText: '52,840 MU', panelKey: 'supply' },
  billed: {
    totalText: 'Total: 45,548 MU',
    okSegment: { valueText: '38,700 MU', flex: 62, tag: 'OK' },
    provSegment: { valueText: '6,848 MU', flex: 16, tag: 'PROV' },
    panelKey: 'billing',
  },
  collected: { valueText: '42,008 MU', panelKey: 'revenue' },
  lossGap: {
    valueText: '10,832 MU',
    percentText: '20.5% of Input',
    monetaryText: '— ₹9,676 Cr',
    panelKey: 'atc',
  },
}
