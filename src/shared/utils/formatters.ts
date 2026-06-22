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