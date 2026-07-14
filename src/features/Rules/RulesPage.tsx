import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { RuleCard } from './components/RuleCard'
import { useRules } from './hooks/useRules'

/**
 * Detection rules — the AI rule engine's thresholds, weights and configuration.
 *
 * Faithful to the prototype's renderRules(): 8 rule cards, state-level, NOT
 * scope-reactive. The prototype renders every control (Enabled, both sliders,
 * the dropdown, the auto-tune button) without wiring any of them; here they
 * work, and "AI auto-tune weights" applies exactly the changes the insight
 * banner recommends.
 */
export default function RulesPage() {
  const r = useRules()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()

  function handleAutoTune() {
    const applied = r.autoTune()
    const summary = applied.map((a) => `${a.ruleId} → ${a.weight}`).join(', ')

    showToast({
      type: 'ai',
      title: '✦ Weights auto-tuned',
      message: `Applied the recommendation from your last 200 inspection outcomes: ${summary}.`,
      duration: 4000,
    })
    logActivity('Auto-tuned rule weights', 'rules', summary)
  }

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="Detection rules"
        subtitle="AI rule engine — thresholds, weights, and configurations"
        actions={
          <>
            <span className="badge badge-active">{r.version}</span>
            <button type="button" className="btn btn-ai btn-sm" onClick={handleAutoTune}>
              ✦ AI auto-tune weights
            </button>
          </>
        }
      />

      <AiInsightBanner title={r.aiInsight.title} className="mb-[14px]">
        <span dangerouslySetInnerHTML={{ __html: r.aiInsight.bodyHtml }} />
      </AiInsightBanner>

      {r.rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          state={r.state[rule.id]}
          spec={r.specs[rule.id]}
          onChange={(key, value) => r.update(rule.id, key, value)}
        />
      ))}
    </div>
  )
}
