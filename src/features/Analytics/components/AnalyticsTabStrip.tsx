import type { AnalyticsTabId } from '../types'

interface AnalyticsTabStripProps {
  activeTab: AnalyticsTabId
  onSelect: (id: AnalyticsTabId) => void
}

const TABS: Array<{ id: AnalyticsTabId; label: string; emoji: string }> = [
  { id: 'audit',       label: 'Energy audit',   emoji: '📈' },
  { id: 'reliability', label: 'Reliability',    emoji: '⚡' },
  { id: 'outage',      label: 'Outage',         emoji: '🔌' },
  { id: 'revenue',     label: 'Revenue',        emoji: '💰' },
  { id: 'pq',          label: 'Power quality',  emoji: '📊' },
]

/**
 * Analytics tabs — underline style matching the prototype's `.tabs`.
 * Active tab has an ai-purple underline and text; inactive tabs are muted.
 */
export function AnalyticsTabStrip({ activeTab, onSelect }: AnalyticsTabStripProps) {
  return (
    <div
      className="mb-4 flex gap-4 overflow-x-auto border-b max-sm:gap-2"
      style={{ borderColor: 'var(--border)' }}
    >
      {TABS.map((t) => {
        const active = t.id === activeTab
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`whitespace-nowrap border-b-2 px-1.5 py-2.5 text-[13px] font-semibold transition-colors ${
              active ? 'text-ai-purple' : 'text-text-mid hover:text-text'
            }`}
            style={{ borderColor: active ? 'var(--ai-purple)' : 'transparent' }}
          >
            {t.emoji} {t.label}
          </button>
        )
      })}
    </div>
  )
}
