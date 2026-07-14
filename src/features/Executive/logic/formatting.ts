// ── Formatting helpers (pure) ────────────────────────────────────────────────
// Live clock + date formatting used by the time-mode bar. Kept pure so they can
// be swapped for i18n or timezone-aware variants without touching components.

/** HH:MM:SS 24-hour local time. */
export function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

/** Short date in en-IN — e.g. "Sat, 11 Jul 2026". */
export function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })
}
