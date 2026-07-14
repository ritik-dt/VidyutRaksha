import { typeColor } from '../data/notifications'
import type { Notification } from '../types'

interface NotificationItemProps {
  notification: Notification
  read: boolean
  onClick: (n: Notification) => void
}

/** One notification card — circular icon badge, type-colored left border, unread bg, right-side dot. */
export function NotificationItem({ notification: n, read, onClick }: NotificationItemProps) {
  const color = typeColor(n.type)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(n)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(n)
        }
      }}
      className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-transform duration-150 hover:translate-x-0.5 max-sm:gap-2"
      style={{
        background: read ? 'var(--bg)' : 'var(--ai-purple-light)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      {/* circular icon badge */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-[20px]"
        style={{ background: 'var(--card)', border: `2px solid ${color}` }}
      >
        {n.icon}
      </div>

      {/* content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2.5">
          <div className="text-[12px] text-text">
            <strong>{n.actor}</strong> {n.action}
          </div>
          <div className="shrink-0 text-[10px] whitespace-nowrap text-text-dim">{n.time}</div>
        </div>
        <div className="mt-[3px] text-[11px] leading-[1.4] text-text-mid">{n.context}</div>
      </div>

      {/* unread indicator dot */}
      {!read && (
        <div
          className="mt-2 size-2 shrink-0 rounded-full"
          style={{ background: 'var(--ai-purple)' }}
          aria-label="Unread"
        />
      )}
    </div>
  )
}
