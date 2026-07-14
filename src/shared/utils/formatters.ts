/** Format a number in Indian locale (e.g. 1,00,000) */
export const formatIndian = (n?: number | null): string =>
  n != null ? n.toLocaleString('en-IN') : '';

export function getLossColor(v: number): string {
  return v > 20 ? '#EF4444' : v > 15 ? '#F59E0B' : '#22C55E';
}

export function getLoadColor(v: number): string {
  return v > 85 ? '#EF4444' : v > 70 ? '#F59E0B' : '#22C55E';
}

export function getStatusBadgeColor(status: string): string {
  const map: Record<string, string> = {
    'New':             'text-blue-700 bg-blue-50 border-blue-200',
    'Assigned':        'text-amber-700 bg-amber-50 border-amber-200',
    'In Progress':     'text-amber-700 bg-amber-50 border-amber-200',
    'Inspected':       'text-amber-700 bg-amber-50 border-amber-200',
    'Confirmed Theft': 'text-red-600 bg-red-50 border-red-200',
    'False Positive':  'text-gray-600 bg-gray-50 border-gray-200',
    'Escalated':       'text-red-600 bg-red-50 border-red-200',
    'Active':          'text-green-600 bg-green-50 border-green-200',
  };
  return map[status] ?? 'text-gray-600 bg-gray-50 border-gray-200';
}
/** Compact Indian-currency formatter (₹ Cr / L / K) — use in KPIs / summaries. */
export function fmtINR(amt?: number | null): string {
  if (amt == null || Number.isNaN(amt)) return '—';
  if (amt >= 10_000_000)
    return `₹${(amt / 10_000_000).toFixed(1).replace(/\.0$/, '')} Cr`;
  if (amt >= 100_000)
    return `₹${(amt / 100_000).toFixed(1).replace(/\.0$/, '')} L`;
  if (amt >= 1_000) return `₹${(amt / 1_000).toFixed(0)}K`;
  return `₹${amt.toLocaleString('en-IN')}`;
}

/**
 * Full Indian-currency formatter — never abbreviates (₹1,94,400 / ₹10,28,400).
 * Use this in TABLE cells and DETAIL views where the prototype shows the exact
 * amount, not an abbreviation. Reserve `fmtINR` (above) for KPI cards and
 * one-line summaries where the prototype uses "₹X L" / "₹X Cr".
 */
export function fmtINRFull(amt?: number | null): string {
  if (amt == null || Number.isNaN(amt)) return '—';
  return `₹${amt.toLocaleString('en-IN')}`;
}
