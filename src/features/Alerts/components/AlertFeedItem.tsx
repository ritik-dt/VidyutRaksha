import { ALERT_CATEGORIES, getSevBg, getSevColor } from '../data/alerts'
import type { AlertItem } from '../types'

interface AlertFeedItemProps {
  alert: AlertItem
  acked: boolean
  onAck: (id: string) => void
  onAction: (alert: AlertItem) => void
}

/** One alert card — severity-tinted background, badges, message, meta, actions. */
export function AlertFeedItem({ alert, acked, onAck, onAction }: AlertFeedItemProps) {
  const color = getSevColor(alert.sev)
  const bg = getSevBg(alert.sev)
  const isStale = !acked && alert.ageMin >= 60
  const catMeta =
    ALERT_CATEGORIES.find((c) => c.id === alert.cat) ?? { icon: '•', label: alert.cat }

  return (
    <div
      className="flex items-start gap-3 rounded-[10px] p-3 max-sm:flex-wrap"
      style={{
        background: bg,
        borderLeft: `4px solid ${color}`,
        boxShadow: isStale ? '0 0 0 1px rgba(230,146,30,0.25)' : undefined,
      }}
    >
      {/* severity + category badges */}
      <div className="flex shrink-0 flex-col items-start gap-1">
        <span
          className="inline-block rounded-[10px] px-2 py-[3px] text-[9px] font-bold whitespace-nowrap text-white"
          style={{ background: color }}
        >
          {alert.sev.toUpperCase()}
        </span>
        <span
          className="inline-flex items-center gap-[3px] rounded-lg px-1.5 py-px text-[9px] font-semibold text-text-mid"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        >
          {catMeta.icon} {catMeta.label.split(' ')[0]}
        </span>
      </div>

      {/* content */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-1.5 text-[13px] font-bold text-text">
          {alert.entity}
          {isStale && (
            <span
              className="rounded-lg px-[5px] py-px text-[9px] font-bold"
              style={{ background: 'rgba(230,146,30,0.12)', color: 'var(--amber)' }}
            >
              ⏰ {Math.floor(alert.ageMin / 60)}h old
            </span>
          )}
          {acked && (
            <span
              className="rounded-lg px-[5px] py-px text-[9px] font-semibold text-text-dim"
              style={{ background: 'var(--border)' }}
            >
              ✓ Acked
            </span>
          )}
        </div>
        <div className="mb-1 text-[12px] text-text-mid">{alert.msg}</div>
        <div className="text-[10px] text-text-dim">
          Rule: {alert.rule} • ID: {alert.id} • {alert.time}
        </div>
      </div>

      {/* actions */}
      <div className="flex shrink-0 gap-1 max-sm:w-full max-sm:justify-end">
        <button
          type="button"
          className="btn btn-ai btn-sm"
          style={{ fontSize: '10px' }}
          onClick={() => onAction(alert)}
        >
          {alert.action}
        </button>
        {!acked && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '10px' }}
            onClick={() => onAck(alert.id)}
          >
            ✓ Ack
          </button>
        )}
      </div>
    </div>
  )
}
