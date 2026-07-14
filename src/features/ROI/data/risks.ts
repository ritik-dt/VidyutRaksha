import type { RiskRow } from '../types'

/** 6 risk rows for "What could go wrong". */
export const RISK_ROWS: RiskRow[] = [
  {
    risk: 'AMISP data feed gaps',
    likelihood: 'Medium',
    likelihoodTone: 'amber',
    impact: 'High',
    mitigation: 'SLA penalty clauses · fallback to monthly MRI batch · graceful degradation in UI',
  },
  {
    risk: 'Inspector adoption resistance',
    likelihood: 'Medium',
    likelihoodTone: 'amber',
    impact: 'High',
    mitigation: 'Mobile app pilot in 1 division before scale · incentive scheme tied to AI-prioritized hits · Hindi UI',
  },
  {
    risk: 'False-positive backlash (consumer complaints)',
    likelihood: 'Low',
    likelihoodTone: 'green',
    impact: 'Medium',
    mitigation: 'Confidence threshold ≥80 for prosecution · 7-day appeal window · genuine-mistake reclassification',
  },
  {
    risk: 'Regulator (UPERC) audit findings',
    likelihood: 'Low',
    likelihoodTone: 'green',
    impact: 'High',
    mitigation: 'Full model lineage · monthly bias audit · CAG-compliant audit trail · open algorithm specification',
  },
  {
    risk: 'Theft pattern evolution outpaces model',
    likelihood: 'High',
    likelihoodTone: 'red',
    impact: 'Medium',
    mitigation: 'Quarterly retrain on new ground truth · drift monitoring (PSI < 0.20) · rule-based fallback for emerging patterns',
  },
  {
    risk: 'Lower-than-projected court conversion',
    likelihood: 'Medium',
    likelihoodTone: 'amber',
    impact: 'Medium',
    mitigation: 'Court-ready dossier template tested on 142 cases · vigilance director sign-off on evidence pack',
  },
]
