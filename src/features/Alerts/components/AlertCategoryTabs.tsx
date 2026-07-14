import { ALERT_CATEGORIES, getCatCount } from '../data/alerts'
import type { AlertCategoryId, AlertItem } from '../types'

interface AlertCategoryTabsProps {
  alerts: AlertItem[]
  activeCat: AlertCategoryId
  onSelect: (id: AlertCategoryId) => void
}

/** Underline-style category tab bar (horizontal scroll on small screens). */
export function AlertCategoryTabs({ alerts, activeCat, onSelect }: AlertCategoryTabsProps) {
  return (
    <div className="flex overflow-x-auto border-b border-border-light bg-bg">
      {ALERT_CATEGORIES.map((cat) => {
        const count = getCatCount(alerts, cat.id)
        const isActive = activeCat === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-[11px] text-[11.5px] transition-all duration-150"
            style={{
              background: isActive ? 'var(--card)' : 'transparent',
              borderBottomColor: isActive ? 'var(--ai-purple)' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--ai-purple)' : 'var(--text-mid)',
            }}
          >
            <span className="text-[13px]">{cat.icon}</span>
            {cat.label}
            <span
              className="inline-flex h-[18px] min-w-[20px] items-center justify-center rounded-[9px] px-[5px] text-[10px] font-bold"
              style={{
                background: isActive ? 'rgba(124,58,237,0.12)' : 'var(--border)',
                color: isActive ? 'var(--ai-purple)' : 'var(--text-mid)',
              }}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
