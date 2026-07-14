import { useNavigate } from 'react-router-dom'
import { useScope } from '@/shared/context/ScopeContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import type { ScreenName } from '@/shared/types'
import { enrichLevel, getOvernightDeltas } from '../adapter'

/**
 * "What changed overnight" delta strip — 4 scope-derived cards.
 * Split out of DashboardKpis so that component holds only the KPI cards.
 */
export default function DashboardOvernightStrip() {
  const navigate = useNavigate()
  const { currentNode } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const overnightDeltas = getOvernightDeltas(level)

  const goTo = (screen?: ScreenName) => {
    if (!screen) return
    navigate(getPathForScreen(screen))
  }

  return (
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
  )
}
