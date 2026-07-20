import { useNavigate } from 'react-router-dom'
import { useRole } from '@/shared/context/RoleContext'
import { useScope } from '@/shared/context/ScopeContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import type { ScreenName } from '@/shared/types'
import { enrichLevel, getHotspots, getQueueByRole } from '../adapter'

export default function DashboardDrilldown() {
  const navigate = useNavigate()
  const { currentRole } = useRole()
  const { currentNode } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const queue = getQueueByRole(currentRole.id, level)
  const hotspots = getHotspots(level)

  const goTo = (screen: ScreenName) => {
    navigate(getPathForScreen(screen))
  }

  return (
    <div className="mb-3.5 grid grid-cols-2 gap-3.5 max-lg:grid-cols-1">
      <div className="mb-0 rounded-xl border border-border bg-card p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.4px] text-text">
            📋 Your queue · today
          </div>
          <div className="text-[10px] text-text-dim">{currentRole.label}</div>
        </div>

        {queue.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center gap-[11px] py-2.5 ${index > 0 ? 'border-t border-border-light' : ''}`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(124,58,237,0.07)] text-[15px] text-ai-purple">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] font-semibold leading-[1.35] text-text">
                {item.label}
              </div>
              <div className="mt-0.5 text-[10px] text-text-dim">{item.meta}</div>
            </div>
            <button
              type="button"
              onClick={() => goTo(item.actionScreen)}
              className="shrink-0 cursor-pointer rounded-lg border-none px-3 py-[5px] text-[10.5px] font-semibold text-white shadow-[var(--ai-glow)] transition-all hover:opacity-85"
              style={{ background: 'var(--ai-gradient)' }}
            >
              {item.action} →
            </button>
          </div>
        ))}
      </div>

      <div className="mb-0 rounded-xl border border-border bg-card p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.4px] text-text">
            🔥 Today&apos;s hotspots
          </div>
          <div className="text-[10px] text-text-dim">
            AI-detected · ranked by impact
          </div>
        </div>

        {hotspots.map((hotspot, index) => (
          <div
            key={hotspot.labelHtml}
            className={`flex items-center gap-[11px] py-2.5 ${index > 0 ? 'border-t border-border-light' : ''}`}
          >
            <div
              className="h-[34px] w-1.5 shrink-0 rounded-[3px]"
              style={{
                background:
                  hotspot.severity === 'red' ? 'var(--red)' : 'var(--amber)',
              }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-[11.5px] leading-[1.35] text-text [&_strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: hotspot.labelHtml }}
              />
              <div className="mt-0.5 text-[10px] text-text-dim">
                {hotspot.meta}
              </div>
            </div>
            <button
              type="button"
              onClick={() => goTo(hotspot.actionScreen)}
              className="shrink-0 rounded-md border-none px-3 py-[5px] text-[10.5px] font-bold text-white"
              style={{
                background:
                  hotspot.severity === 'red' ? 'var(--red)' : 'var(--amber)',
                cursor: 'pointer',
              }}
            >
              {hotspot.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
