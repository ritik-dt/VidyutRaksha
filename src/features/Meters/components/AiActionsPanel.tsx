import { fmtINR } from '@/features/Dashboard/adapter'
import { useToast } from '@/shared/context/ToastContext'

interface AiActionsPanelProps {
  scopeName: string
  criticalCount: number
  highCount: number
  estMonthlyLoss: number
}

/**
 * Matches prototype's "✦ AI-recommended actions" card with 3 sub-cards:
 * 1. Auto-create critical cases  2. Schedule field-inspection batch  3. Draft Section 135 notices
 */
export function AiActionsPanel({ scopeName, criticalCount, highCount, estMonthlyLoss }: AiActionsPanelProps) {
  const { showToast } = useToast()

  const topN = Math.min(20, criticalCount)
  const clusteredConsumers = Math.round(criticalCount * 0.35)
  const noticeConsumers = Math.round(highCount * 0.22)
  const combinedExposure = fmtINR(Math.round(estMonthlyLoss * 0.45))

  return (
    <div
      className="card mb-0"
      style={{
        border: '2px solid rgba(124,58,237,0.2)',
        background:
          'linear-gradient(135deg,rgba(124,58,237,0.04) 0%,rgba(124,58,237,0.01) 60%,rgba(255,255,255,0) 100%), var(--card)',
      }}
    >
      <div className="card-title mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-bold">
          ✦ <span>AI-recommended actions for {scopeName}</span>
          <span className="ai-live-badge">Live</span>
        </span>
        <span className="text-[10.5px] text-text-dim">Refreshed every 30 min · Last update: 2 min ago</span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {/* Action 1 */}
        <div className="flex flex-col gap-2 rounded-[9px] border border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex size-[30px] items-center justify-center rounded-lg text-[14px]" style={{ background: 'rgba(220,53,69,0.1)', color: '#DC3545' }}>
              ⚠️
            </div>
            <div className="text-[11.5px] font-bold text-text">Auto-create top {topN} critical cases</div>
          </div>
          <div className="text-[11px] leading-[1.5] text-text-mid">
            Highest-risk consumers in your scope. Estimated{' '}
            <strong style={{ color: 'var(--green)' }}>{combinedExposure}</strong>/month combined exposure.
            Routes to nearest inspectors automatically.
          </div>
          <div className="mt-auto flex items-center gap-1.5 pt-1.5">
            <span className="text-[9.5px] text-text-dim">~4hr inspector workload</span>
          </div>
          <button
            type="button"
            className="rounded-[7px] py-[7px] text-[11px] font-bold text-white"
            style={{ background: 'var(--ai-gradient)' }}
            onClick={() => {
              showToast({
                type: 'success',
                title: 'Cases auto-created',
                message: `Created ${topN} critical cases in ${scopeName}. Routed to nearest inspectors with optimized route.`,
                duration: 5000,
              })
              // navigate(getPathForScreen('cases'))
            }}
          >
            ✦ Create cases now →
          </button>
        </div>

        {/* Action 2 */}
        <div className="flex flex-col gap-2 rounded-[9px] border border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex size-[30px] items-center justify-center rounded-lg text-[14px]" style={{ background: 'rgba(0,123,255,0.1)', color: '#007BFF' }}>
              📍
            </div>
            <div className="text-[11.5px] font-bold text-text">Schedule field-inspection batch</div>
          </div>
          <div className="text-[11px] leading-[1.5] text-text-mid">
            AI-clustered <strong>{clusteredConsumers} consumers</strong> in 3 geographic zones for
            efficient route planning. <strong>22% time saving</strong> vs ad-hoc dispatch.
          </div>
          <div className="mt-auto flex items-center gap-1.5 pt-1.5">
            <span className="text-[9.5px] text-text-dim">3 routes · 8 inspectors</span>
          </div>
          <button
            type="button"
            className="rounded-[7px] border py-[7px] text-[11px] font-bold"
            style={{ background: 'var(--card)', color: 'var(--ai-purple)', borderColor: 'var(--ai-purple)' }}
            onClick={() =>
              showToast({
                type: 'success',
                title: 'Field batch scheduled',
                message: `AI optimized 3 routes for ${clusteredConsumers} consumers. Inspector calendars updated.`,
                duration: 5000,
              })
            }
          >
            📅 Schedule batch →
          </button>
        </div>

        {/* Action 3 */}
        <div className="flex flex-col gap-2 rounded-[9px] border border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex size-[30px] items-center justify-center rounded-lg text-[14px]" style={{ background: 'rgba(40,167,69,0.1)', color: 'var(--green)' }}>
              📄
            </div>
            <div className="text-[11.5px] font-bold text-text">Draft Section 135 notices</div>
          </div>
          <div className="text-[11px] leading-[1.5] text-text-mid">
            Pre-fill statutory notices for <strong>{noticeConsumers} confirmed-pattern</strong> consumers
            with evidence packs. Awaits SE review.
          </div>
          <div className="mt-auto flex items-center gap-1.5 pt-1.5">
            <span className="text-[9.5px] text-text-dim">Saves ~12 hrs of clerical work</span>
          </div>
          <button
            type="button"
            className="rounded-[7px] border py-[7px] text-[11px] font-bold"
            style={{ background: 'var(--card)', color: 'var(--green)', borderColor: 'var(--green)' }}
            onClick={() => {
              showToast({
                type: 'success',
                title: 'Notices drafted',
                message: `${noticeConsumers} Section 135 notices drafted with evidence packs. Routed to SE inbox for review.`,
                duration: 5000,
              })
              // navigate(getPathForScreen('notices'))
            }}
          >
            ✉️ Draft notices →
          </button>
        </div>
      </div>
    </div>
  )
}
