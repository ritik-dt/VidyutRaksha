import type { RulesAiInsight } from '../types'

/**
 * AI tuning recommendation. The two weight changes it names are exactly what
 * the "AI auto-tune weights" button applies — the banner and the button agree,
 * rather than the button doing something the user wasn't told about.
 */
export const RULES_AI_INSIGHT: RulesAiInsight = {
  title: '✦ AI tuning recommendation',
  bodyHtml:
    'Based on your last 200 inspection outcomes, I suggest <strong>raising R02 (Earth Loading) weight from 9 to 10</strong> — it has a 73% confirmation rate. Also consider <strong>lowering R05 (Night Anomaly) to 4</strong> — it generates 38% false positives in agricultural areas.',
  autoTune: [
    { ruleId: 'R02', weight: 10 },
    { ruleId: 'R05', weight: 4 },
  ],
}
