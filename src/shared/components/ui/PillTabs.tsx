import { cn } from './cn'

export interface PillTabOption<Id extends string = string> {
  id: Id
  label: string
  /** Optional count shown in parentheses next to the label (e.g. "Unread (4)"). */
  count?: number
}

interface PillTabsProps<Id extends string> {
  tabs: PillTabOption<Id>[]
  activeTab: Id
  onSelect: (id: Id) => void
  className?: string
}

/**
 * Pill-style filter row — port of the prototype's .filter-row. Reusable across
 * modules (Notifications, Photos, …). Active pill uses ai-purple; the row wraps
 * on desktop and scrolls horizontally on mobile.
 */
export function PillTabs<Id extends string>({
  tabs,
  activeTab,
  onSelect,
  className,
}: PillTabsProps<Id>) {
  return (
    <div
      className={cn(
        'mb-3.5 flex flex-wrap gap-1.5 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:pb-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const label = tab.count !== undefined && tab.count > 0 ? `${tab.label} (${tab.count})` : tab.label
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className="shrink-0 cursor-pointer rounded-[14px] border px-[11px] py-[5px] text-[11px] font-semibold whitespace-nowrap transition-all duration-150"
            style={{
              background: isActive ? 'var(--ai-purple)' : 'var(--card)',
              borderColor: isActive ? 'var(--ai-purple)' : 'var(--border)',
              color: isActive ? '#fff' : 'var(--text-mid)',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
