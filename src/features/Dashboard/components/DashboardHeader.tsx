import { Sparkles } from 'lucide-react'
import { HIER_ICONS } from '@/data/hierarchy'
import { useScope } from '@/shared/context/ScopeContext'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { enrichLevel, fmtINR } from '../adapter'
import DashboardBreadcrumb from './DashboardBreadcrumb'
import { ScopePill } from '@/shared/components/ui/ScopePill'

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
    const meters = level.meters ?? 0
    const flagged = level.flagged ?? 0
    const flaggedPct = meters ? ((flagged / meters) * 100).toFixed(1) : '0'
    const realizationRate =
      (level.assessed ?? 0) > 0
        ? (((level.realized ?? 0) / (level.assessed ?? 1)) * 100).toFixed(0)
        : '0'

    showToast({
      type: 'ai',
      title: `✦ AI insights — ${level.name}`,
      message:
        `${level.name} (${level.type} level) at ${level.loss}% AT&C loss · ` +
        `inspection hit rate ${level.hitRate}%. ` +
        `${formatIndian(level.critical)} critical flags among ${formatIndian(flagged)} flagged meters ` +
        `(${flaggedPct}% of ${formatIndian(meters)}). ` +
        `Assessment realization ${realizationRate}% (${fmtINR(level.realized)} of ${fmtINR(level.assessed)}).`,
      duration: 6000,
    })
  }

  return (
    <>
      <DashboardBreadcrumb />

      <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[20px] font-bold">
            {icon} {level.name}
          </div>
          <div className="mt-0.5 text-[12px] text-text-dim">
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

        <div className="flex flex-wrap gap-1.5">
          {hierPath.length > 1 && (
            <button
              type="button"
              onClick={() => navigateToPathIndex(hierPath.length - 2)}
              className="cursor-pointer rounded-lg border border-border bg-card px-3 py-[5px] text-[11px] font-semibold text-text-mid transition-all hover:opacity-85"
            >
              ← Back
            </button>
          )}
          <button
            type="button"
            onClick={toggleScopePicker}
            title="Change scope"
            className="cursor-pointer rounded-lg border bg-card px-[9px] py-[3px] text-[10px] font-semibold transition-all hover:opacity-85"
            style={{ color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
          >
            ↕ Change scope
          </button>
          <button
            type="button"
            onClick={showAiInsights}
            className="flex cursor-pointer items-center gap-1 rounded-lg border-none px-3 py-[5px] text-[11px] font-semibold text-white shadow-[var(--ai-glow)] transition-all hover:opacity-85"
            style={{ background: 'var(--ai-gradient)' }}
          >
            <Sparkles size={11} /> AI insights
          </button>
        </div>
      </div>

      <ScopePill />
    </>
  )
}
