import type { RecoveryScenario } from '../types'

/** 3 AI-attributable recovery scenarios. */
export const RECOVERY_SCENARIOS: RecoveryScenario[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    recovery: '₹340 Cr',
    pct: '8%',
    tone: 'amber',
    desc: 'Assumes only 8% capture of theft pool · proven KPMG benchmark in similar SEB pilots',
    assumptions: [
      'Inspector capacity at current strength',
      'No tariff-policy changes',
      'Baseline 12,040 inspections/year FYTD pace',
      '47% hit-rate (current)',
    ],
  },
  {
    id: 'realistic',
    label: 'Realistic (base case)',
    recovery: '₹740 Cr',
    pct: '17.4%',
    tone: 'purple',
    desc: 'Targeted scope mirroring the prototype: 5 DISCOMs · 15L smart meters · 24-month ramp',
    assumptions: [
      '+30% inspector productivity from AI-prioritized queue',
      '+15pp hit-rate uplift (47% → 62%)',
      '20% recovery uplift from better evidence (court conversion)',
      '8% reduction in false-positive site visits',
    ],
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    recovery: '₹1,180 Cr',
    pct: '27.7%',
    tone: 'green',
    desc: 'Full deployment + RDSS-funded DT-meter expansion · year-3 steady state',
    assumptions: [
      'AMISP push-data live across all DISCOMs',
      'Section 135 court conversion at 85% (vs 67% today)',
      'Mobile-app inspector workflow rolled out statewide',
      'Cluster-based bulk inspections enabled',
    ],
  },
]
