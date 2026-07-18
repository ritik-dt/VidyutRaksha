/**
 * Risk-band color helper.
 *
 * Extracted from `StatusBadge.tsx` so that file exports only components,
 * which lets Fast Refresh preserve state across edits.
 *
 * The thresholds match the app's canonical risk-band mapping (>=80 critical,
 * >=60 high, otherwise medium) and return CSS variable expressions so the
 * colours pick up light/dark theme swaps automatically.
 */
export function getRiskColor(risk: number): string {
  return risk >= 80 ? 'var(--red)' : risk >= 60 ? 'var(--amber)' : 'var(--green)'
}
