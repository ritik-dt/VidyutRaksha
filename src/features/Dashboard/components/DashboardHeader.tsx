import { Sparkles } from 'lucide-react'
import { HIER_ICONS } from '@/data/hierarchy'
import { useScope } from '@/shared/context/ScopeContext'
import { useToast } from '@/shared/context/ToastContext'
import { enrichLevel } from '../adapter'
import DashboardBreadcrumb from './DashboardBreadcrumb'
import DashboardScopePill from './DashboardScopePill'

export default function DashboardHeader() {
  const { showToast } = useToast()
  const {
    currentNode,
    hierPath,
    navigateToPathIndex,
    toggleScopePicker,
  } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const icon = HIER_ICONS[level.type] ?? ''
  const isConsumerLevel = level.type === 'DTR'

  const showAiInsights = () => {
    showToast({
      type: 'ai',
      title: '✦ AI Insights generating',
      message:
        'Varanasi zone at 17.7%, ranked #5 nationally. Bhelupur improved -2.2pp. 847 high-risk flags today, ~₹4.2L daily exposure.',
      duration: 6000,
    })
  }

  return (
    <>
      <DashboardBreadcrumb />

      <div className="page-header mb-2.5 flex items-center justify-between">
        <div>
          {/* <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-text-mid">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-[7px] animate-pulse-dot rounded-full bg-green shadow-[0_0_6px_rgba(40,167,69,0.6)]" />
              <strong className="font-bold text-green">LIVE</strong>
            </div>
            <span className="text-text-dim">·</span>
            <span>
              Last batch{' '}
              <strong className="text-text">06 May 2026, 06:00 IST</strong>
            </span>
            <span className="text-text-dim">·</span>
            <span className="text-text-dim">Next batch: 14:00 IST</span>
          </div> */}
          <div className="page-title text-[20px] font-bold">
            {icon} {level.name}
          </div>
          <div className="page-sub mt-0.5 text-[12px] text-text-dim">
            {level.type} level
            {isConsumerLevel ? ` — ${level.meters} consumers under this DTR` : ''}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-text-mid">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-[7px] animate-pulse-dot rounded-full bg-green shadow-[0_0_6px_rgba(40,167,69,0.6)]" />
              <strong className="font-bold text-green">LIVE</strong>
            </div>
            <span className="text-text-dim">·</span>
            <span>
              Last batch{' '}
              <strong className="text-text">06 May 2026, 06:00 IST</strong>
            </span>
            <span className="text-text-dim">·</span>
            <span className="text-text-dim">Next batch: 14:00 IST</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          {hierPath.length > 1 && (
            <button
              type="button"
              onClick={() => navigateToPathIndex(hierPath.length - 2)}
              className="btn btn-outline btn-sm"
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={toggleScopePicker}
            title="Change scope"
            className="btn btn-outline btn-sm border-[rgba(124,58,237,0.3)] text-ai-purple"
          >
            ↕ Change scope
          </button>
          <button
            type="button"
            onClick={showAiInsights}
            className="btn btn-ai btn-sm flex items-center gap-1"
          >
            <Sparkles size={11} /> AI insights
          </button>
        </div>
      </div>

      <DashboardScopePill />
    </>
  )
}
