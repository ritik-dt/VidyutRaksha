import type { CompareTabId } from '../types'

interface CompareTabStripProps {
  activeTab: CompareTabId
  onSelect: (id: CompareTabId) => void
}

const TABS: Array<{ id: CompareTabId; label: string; emoji: string }> = [
  { id: 'peer',   label: 'Peer comparison',        emoji: '⇄' },
  { id: 'yoy',    label: 'Year-over-year',         emoji: '📅' },
  { id: 'ba',     label: 'Before / After (Impact)', emoji: '📊' },
  { id: 'pct',    label: 'Percentile ranking',     emoji: '🏆' },
  { id: 'pareto', label: 'Pareto (80/20)',         emoji: '🎯' },
  { id: 'whatif', label: 'What-if simulator',      emoji: '🧪' },
]

/** Compare tabs — underline style matching the prototype's `.tabs`. */
export function CompareTabStrip({ activeTab, onSelect }: CompareTabStripProps) {
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
