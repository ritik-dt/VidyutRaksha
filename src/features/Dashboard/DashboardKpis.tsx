import { useNavigate } from 'react-router-dom'
import { useScope } from '@/context/ScopeContext'
import { getPathForScreen } from '@/utils/navigation'
import type { ScreenName } from '@/types'
import {
  enrichLevel,
  getMainKpiCards,
  getOvernightDeltas,
} from './dashboardAdapter'
import DashboardAiAnalysis from './DashboardAiAnalysis'

export default function DashboardKpis() {
  const navigate = useNavigate()
  const { currentNode } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const overnightDeltas = getOvernightDeltas(level)
  const mainKpis = getMainKpiCards(level)

  // const goTo = (screen: ScreenName) => {
  //   navigate(getPathForScreen(screen))
  // }

  const goTo = (screen?: ScreenName) => {
  if (!screen) return
  navigate(getPathForScreen(screen))
}

  return (
    <>
      <div className="mb-3.5 grid grid-cols-4 gap-2 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {overnightDeltas.map((delta) => (
          <button
            key={delta.label}
            type="button"
            onClick={() => goTo(delta.screen)}
            title={delta.sub}
            className="cursor-pointer rounded-[9px] border p-[11px_14px] text-left transition-shadow hover:shadow-md"
            style={{
              background: delta.bg,
              borderColor: delta.border,
            }}
          >
            <div
              className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.5px]"
              style={{ color: delta.color }}
            >
              {delta.label}
            </div>
            <div
              className="font-mono text-[18px] font-extrabold leading-[1.1]"
              style={{ color: delta.color }}
            >
              {delta.value}
            </div>
            <div className="mt-0.5 text-[10px] text-text-mid">{delta.sub}</div>
          </button>
        ))}
      </div>

       <DashboardAiAnalysis />

      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {mainKpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => goTo(kpi.screen)}
            className="kpi-card clickable relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all"
          >
            <div
              className="kpi-accent absolute left-0 top-0 h-full w-1 rounded-l-xl"
              style={{ background: kpi.accentColor }}
            />
            <div className="kpi-label mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">
              {kpi.label}
            </div>
            <div
              className="kpi-value font-mono text-2xl font-extrabold"
              style={{ color: kpi.valueColor ?? 'var(--text)' }}
            >
              {kpi.value}
            </div>
            <div className="kpi-sub mt-0.5 text-[10px] text-text-mid">
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
    </>
  )
}
