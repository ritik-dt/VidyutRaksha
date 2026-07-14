import { NOTIFICATION_TABS } from '../data/notifications'
import { NotificationItem } from './NotificationItem'
import type { Notification, NotificationFilterId } from '../types'

interface NotificationsListProps {
  notifications: Notification[]
  filtered: Notification[]
  activeTab: NotificationFilterId
  isRead: (id: string, seed: boolean) => boolean
  onItemClick: (n: Notification) => void
}

/** Card with dynamic header ("All notifications" or "{tab} notifications · N of M") + list. */
export function NotificationsList({
  notifications,
  filtered,
  activeTab,
  isRead,
  onItemClick,
}: NotificationsListProps) {
  const activeMeta = NOTIFICATION_TABS.find((t) => t.id === activeTab)
  const heading = activeTab === 'all' ? 'All notifications' : `${activeMeta?.label} notifications`

  return (
    <div className="card">
      <div className="card-title flex items-center justify-between">
        <span>{heading}</span>
        {activeTab !== 'all' && (
          <span className="text-[11px] font-normal text-text-dim">
            {filtered.length} of {notifications.length}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-9 text-center text-[13px] text-text-dim">
          <div className="mb-2 text-[32px] opacity-50">✨</div>
          <div className="font-semibold text-text-mid">No notifications in this view</div>
          <div className="mt-1 text-[11px]">Try a different filter or clear the current one</div>
        </div>
      ) : (
        <div className="mt-2.5 flex flex-col gap-1.5">
          {filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              read={isRead(n.id, n.read)}
              onClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
