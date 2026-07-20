import { useNavigate } from 'react-router-dom'
import { useScope } from '@/shared/context/ScopeContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import type { ScreenName } from '@/shared/types'
import { enrichLevel, getMainKpiCards } from '../adapter'

export default function DashboardKpis() {
  const navigate = useNavigate()
  const { currentNode } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const mainKpis = getMainKpiCards(level)

  const goTo = (screen?: ScreenName) => {
    if (!screen) return
    navigate(getPathForScreen(screen))
  }

  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {mainKpis.map((kpi) => (
        <button
          key={kpi.label}
          type="button"
          onClick={() => goTo(kpi.screen)}
          className="group relative min-w-[140px] flex-1 cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:border-ai-purple-mid hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)]"
        >
          {/* Hover-only "→" indicator (was `.kpi-card.clickable::after`) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-2.5 text-base text-text-dim opacity-0 transition-all group-hover:right-2.5 group-hover:text-ai-purple group-hover:opacity-100"
          >
            →
          </span>

          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
            style={{ background: kpi.accentColor }}
          />
          <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">
            {kpi.label}
          </div>
          <div
            className="font-mono text-2xl font-extrabold"
            style={{ color: kpi.valueColor ?? 'var(--text)' }}
          >
            {kpi.value}
          </div>
          <div className="mt-0.5 text-[10px] leading-[1.4] text-text-mid">
            {kpi.sub}
          </div>

          {kpi.breakdown && (
            <>
              <div className="mt-1.5 flex h-1 overflow-hidden rounded-[3px] bg-black/6">
                <div
                  style={{
                    background: 'var(--red)',
                    width: `${kpi.breakdown.criticalPct.toFixed(1)}%`,
                  }}
                  title={`Critical: ${kpi.breakdown.critical}`}
                />
                <div
                  style={{
                    background: 'var(--amber)',
                    width: `${kpi.breakdown.highPct.toFixed(1)}%`,
                  }}
                  title={`High: ${kpi.breakdown.high}`}
                />
                <div
                  style={{
                    background: '#F4A847',
                    width: `${kpi.breakdown.mediumPct.toFixed(1)}%`,
                  }}
                  title={`Medium: ${kpi.breakdown.medium}`}
                />
              </div>
              <div className="mt-0.5 flex justify-between text-[8.5px] font-bold tracking-[0.2px]">
                <span className="text-red">⚠ {kpi.breakdown.critical}</span>
                <span className="text-amber">{kpi.breakdown.high} high</span>
                <span className="text-amber-dark">
                  {kpi.breakdown.medium} med
                </span>
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  )
}
