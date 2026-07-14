import { ALERT_CATEGORIES } from '../data/alerts'
import { AlertCategoryTabs } from './AlertCategoryTabs'
import { AlertFeedItem } from './AlertFeedItem'
import type { AlertCategoryId, AlertFilter, AlertItem } from '../types'

interface AlertFeedProps {
  alerts: AlertItem[]
  filtered: AlertItem[]
  activeCat: AlertCategoryId
  onSelectCat: (id: AlertCategoryId) => void
  filter: AlertFilter
  ackedMap: Record<string, boolean>
  onAck: (id: string) => void
  onAction: (alert: AlertItem) => void
}

/** Category-tabs card + the filtered alert feed (matches the prototype layout). */
export function AlertFeed({
  alerts,
  filtered,
  activeCat,
  onSelectCat,
  filter,
  ackedMap,
  onAck,
  onAction,
}: AlertFeedProps) {
  const activeCategory = ALERT_CATEGORIES.find((c) => c.id === activeCat)
  const heading = activeCat === 'all' ? 'Active alerts' : `${activeCategory?.label} alerts`
  const hasFilter = Boolean(filter.severity || filter.status)

  return (
    <div className="card overflow-hidden" style={{ padding: 0 }}>
      <AlertCategoryTabs alerts={alerts} activeCat={activeCat} onSelect={onSelectCat} />

      <div className="p-[14px_16px] max-sm:p-3">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <span className="text-[12px] font-bold">{heading}</span>
          <span className="shrink-0 text-[11px] font-normal text-text-dim">
            {filtered.length} of {alerts.length} alerts
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-9 text-center text-[13px] text-text-dim">
            <div className="mb-2 text-[32px] opacity-50">✨</div>
            <div className="font-semibold text-text-mid">No alerts in this view</div>
            <div className="mt-1 text-[11px]">
              {hasFilter
                ? 'Try clearing the filter to see all alerts'
                : activeCat !== 'all'
                  ? `No ${activeCategory?.label.toLowerCase()} alerts at this time`
                  : 'Try clearing the filter to see all alerts'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((alert) => (
              <AlertFeedItem
                key={alert.id}
                alert={alert}
                acked={Boolean(ackedMap[alert.id])}
                onAck={onAck}
                onAction={onAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
