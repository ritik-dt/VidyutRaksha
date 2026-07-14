import { cn } from './cn'

export interface FilterPillEntry {
  label: string
  value: string
}

interface FilterPillProps {
  entries: FilterPillEntry[]
  onClear: () => void
  /** Optional "← Back to {backLabel}" button (matches the prototype's back-to-source). */
  backLabel?: string
  onBack?: () => void
  className?: string
}

/**
 * Active-filter bar — port of the prototype's renderFilterPill(): a funnel icon,
 * "FILTERED", one chip per active filter, an optional "Back to {source}" button,
 * and a "Clear filter" button. Shared so any screen can show the filter set by a
 * KPI click.
 */
export function FilterPill({ entries, onClear, backLabel, onBack, className }: FilterPillProps) {
  if (entries.length === 0) return null

  return (
    <div
      className={cn(
        'mb-3 flex flex-wrap items-center gap-2.5 rounded-lg border px-3.5 py-2.5',
        className,
      )}
      style={{ background: 'var(--ai-purple-light)', borderColor: 'var(--ai-purple-mid)' }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: 'var(--ai-purple)', flexShrink: 0 }}
      >
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-ai-purple">
        Filtered
      </span>
      {entries.map((entry) => (
        <span
          key={entry.label}
          className="inline-flex items-center gap-1 rounded-xl border bg-card px-3 py-[3px] text-[11px] font-semibold text-ai-purple"
          style={{ borderColor: 'var(--ai-purple-mid)' }}
        >
          <strong>{entry.label}:</strong> {entry.value}
        </span>
      ))}
      <div className="flex-1" />
      {backLabel && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold text-ai-purple"
          style={{ background: 'transparent', borderColor: 'var(--ai-purple-mid)' }}
        >
          ← Back to {backLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onClear}
        className="cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold text-white"
        style={{ background: 'var(--ai-purple)' }}
      >
        × Clear filter
      </button>
    </div>
  )
}
