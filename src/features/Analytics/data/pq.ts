import type { HierNode } from '@/shared/types/hierarchy'

/** Voltage distribution chart — exact port from prototype's initPQCharts. */
export const VOLTAGE_DATA = {
  labels: ['<180V', '180-200V', '200-220V', '220-240V', '240-260V', '>260V'],
  values: [1200, 16800, 420000, 980000, 72000, 27000],
  colors: ['#8B2332', '#DC3545', '#E6921E', '#28A745', '#17A2B8', '#DC3545'],
}

/** Power factor distribution chart. */
export const PF_DATA = {
  labels: ['<0.70', '0.70-0.80', '0.80-0.85', '0.85-0.90', '0.90-0.95', '0.95-1.0'],
  values: [4200, 18400, 73400, 480000, 620000, 304000],
  colors: ['#8B2332', '#DC3545', '#E6921E', '#28A745', '#28A745', '#17A2B8'],
}

/* ── Hierarchy-aware KPIs ── */

export interface PqKpis {
  vdiPct: string           // hardcoded 8.4%
  vDeviations: number       // hardcoded 36
  powerFactor: string       // hardcoded 0.91
  lowPfConsumers: number    // meters × 0.064
  vUnbalanceV: string       // hardcoded 14.2 V
  currentUnbalancePct: string // hardcoded 3.2%
  pfPenaltyCr: string       // meters × 0.00008 / 100 → toFixed(1) for the AI banner
}

/** Prototype's scope-aware calc. */
export function computePqKpis(level: HierNode | undefined): PqKpis {
  const meters = level?.meters ?? 1500000
  return {
    vdiPct: '8.4',
    vDeviations: 36,
    powerFactor: '0.91',
    lowPfConsumers: Math.round(meters * 0.064),
    vUnbalanceV: '14.2',
    currentUnbalancePct: '3.2',
    pfPenaltyCr: ((meters * 0.00008) / 100).toFixed(1),
  }
}

/* ── PF penalty top consumers table (4 hardcoded rows) ── */

export interface PfPenaltyRow {
  consumer: string
  category: string
  avgPf: number
  avgPfColor: 'red' | 'amber'
  kvah: number
  kwh: number
  penaltyEst: number
  penaltyColor: 'red' | 'amber'
}

export const PF_PENALTY_ROWS: PfPenaltyRow[] = [
  { consumer: 'M/S AGRAUTO',        category: 'Industrial (LMV6)', avgPf: 0.68, avgPfColor: 'red',   kvah: 18400, kwh: 12512, penaltyEst: 24800, penaltyColor: 'red' },
  { consumer: 'MS BRANCH MANAGER',  category: 'Commercial (LMV2)', avgPf: 0.72, avgPfColor: 'red',   kvah: 12600, kwh: 9072,  penaltyEst: 18200, penaltyColor: 'red' },
  { consumer: 'M/S BHARTIYA TELI',  category: 'Commercial (LMV2)', avgPf: 0.78, avgPfColor: 'amber', kvah: 8900,  kwh: 6942,  penaltyEst: 12400, penaltyColor: 'amber' },
  { consumer: 'HEERA LAL AGRAWAL',  category: 'Commercial (LMV2)', avgPf: 0.81, avgPfColor: 'amber', kvah: 6200,  kwh: 5022,  penaltyEst: 8600,  penaltyColor: 'amber' },
]
