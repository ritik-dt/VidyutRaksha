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
    <div className="filter-row" style={{ justifyContent: 'center' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Try:</span>
      {suggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          className="filter-btn"
          onClick={() => onPick(s.label)}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
