import type { NlSuggestion } from '../types'

interface NlSuggestionChipsProps {
  suggestions: NlSuggestion[]
  /** Populates the query input with the chip's text (matches the port decision). */
  onPick: (label: string) => void
}

/**
 * "Try: [chip] [chip] [chip]" row, centered. Port of the prototype's
 * .filter-row / .filter-btn markup. The prototype's chips have no click
 * handler; here we make them fill the input for minimum-intrusion wiring.
 */
export function NlSuggestionChips({ suggestions, onPick }: NlSuggestionChipsProps) {
  return (
    <div className="flex gap-[6px] mb-[14px] flex-wrap justify-center">
      <span className="text-[11px] text-[var(--text-dim)]">Try:</span>
      {suggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          className="py-[5px] px-3 rounded-[18px] border border-[var(--border)] bg-[var(--card)] text-[var(--text-mid)] text-[11px] cursor-pointer font-[var(--font)]"
          onClick={() => onPick(s.label)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
