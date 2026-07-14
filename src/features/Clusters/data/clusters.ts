import type {
  Cluster,
  ClusterMember,
  ClusterReason,
  ClusterStats,
} from '../types'

/**
 * Coordinated-theft cases — mirrors the prototype's allClusters exactly.
 * API-ready: replace this array (keeping the shape) with a live feed later.
 */
export const ALL_CLUSTERS: Cluster[] = [
  { id: 'CL-2026-042', name: 'Vijaya Complex Cluster', dtr: 'Vijaya Complex (Kothi)', feeder: 'Bhelupur', members: 5, confirmed: 2, pending: 3, amount: '₹10,28,400', amountNum: 1028400, pattern: 'Earth loading + tariff misuse', started: 'Nov 2025', risk: 94, status: 'Active investigation', lead: 'Rajesh Kumar' },
  { id: 'CL-2026-038', name: 'Rathayatra Sector-4 Cluster', dtr: 'RYT-DTR-014', feeder: 'Rathayatra', members: 8, confirmed: 3, pending: 5, amount: '₹18,42,600', amountNum: 1842600, pattern: 'Synchronized zero consumption', started: 'Dec 2025', risk: 91, status: 'Active investigation', lead: 'Amit Singh' },
  { id: 'CL-2026-031', name: 'Raghunath Industrial Cluster', dtr: 'RAG-DTR-007', feeder: 'Raghunath Nagar', members: 4, confirmed: 4, pending: 0, amount: '₹24,80,000', amountNum: 2480000, pattern: 'CT manipulation (industrial)', started: 'Sep 2025', risk: 96, status: 'All confirmed', lead: 'Sunita Verma' },
  { id: 'CL-2026-025', name: 'Chauk Market Cluster', dtr: 'CHK-DTR-021', feeder: 'Chauk', members: 12, confirmed: 8, pending: 2, amount: '₹32,14,800', amountNum: 3214800, pattern: 'Meter bypass (commercial)', started: 'Jul 2025', risk: 88, status: 'Recovery phase', lead: 'Priya Mishra' },
  { id: 'CL-2026-018', name: 'Aminabad Residential Cluster', dtr: 'AMN-DTR-003', feeder: 'Shaktipeeth', members: 6, confirmed: 0, pending: 6, amount: '₹8,64,000', amountNum: 864000, pattern: 'Magnetic tamper (domestic)', started: 'Feb 2026', risk: 82, status: 'New cluster', lead: 'Unassigned' },
]

/** Members of the featured case CL-2026-042 (Vijaya Complex). */
export const VIJAYA_MEMBERS: ClusterMember[] = [
  { name: 'HEERA LAL AGRAWAL', meter: '#1849966', detail: 'Earth loading · ₹3,88,800', status: 'Confirmed' },
  { name: 'BHUWAL JAISWAL', meter: '#SC10178896', detail: 'Earth loading · ₹2,14,600', status: 'Confirmed' },
  { name: 'ANAND PRAKASH AGARWAL', meter: '#AL2861165', detail: 'Tariff misuse · Est. ₹86,400', status: 'Under inspection' },
  { name: 'ISHANT', meter: '#AL2860041', detail: 'Earth loading suspected · Est. ₹1,42,800', status: 'Pending' },
  { name: 'RAVI SHANKAR', meter: '#AL2860089', detail: 'Earth loading suspected · Est. ₹1,96,000', status: 'Pending' },
]

/** "Why these 5 are linked" evidence for CL-2026-042. */
export const VIJAYA_REASONS: ClusterReason[] = [
  { icon: '⏱', title: 'Same-window tamper pattern', body: 'All 5 consumers showed consumption drop within <strong>14-day window</strong> (Nov 18 – Dec 2, 2025). Probability of coincidence: &lt;0.3%.' },
  { icon: '📍', title: 'Same DTR & street', body: 'All members on same DTR. 3 of 5 are adjacent physical neighbours. Distance between all 5: &lt;80m radius.' },
  { icon: '🔧', title: 'Identical theft method', body: '4 of 5 show earth loading signature (event codes 69/70 paired). 1 shows tariff misuse (residential-to-commercial). <strong>Same electrician/lineman likely involved.</strong>' },
  { icon: '💼', title: 'Common business linkage', body: 'All 5 are commercial consumers. 2 share a common supplier relationship — indicates commercial network coordination.' },
]

/**
 * Scope filter — exact port of the prototype logic:
 * State/UPPCL → all; KVVNL/Varanasi/EUDC1 branch → all (Bhelupur → Bhelupur-feeder
 * only; DTR → matching DTR); any other DISCOM branch → none.
 */
export function filterClustersByScope(
  hierPath: string[],
  scopeId: string,
  scopeType: string,
  scopeName: string,
): Cluster[] {
  const isStateLevel = scopeType === 'State' || !scopeId || scopeId === 'uppcl'
  if (isStateLevel) return ALL_CLUSTERS

  const pathSet = new Set(hierPath)
  if (pathSet.has('kvvnl') || pathSet.has('varanasi') || pathSet.has('eudc1')) {
    if (pathSet.has('bhelupur') || scopeId === 'bhelupur' || scopeId === 'sd_bhelupur') {
      return ALL_CLUSTERS.filter((c) => c.feeder === 'Bhelupur')
    }
    if (scopeType === 'DTR') {
      const name = (scopeName || '').toLowerCase()
      return ALL_CLUSTERS.filter((c) => c.dtr.toLowerCase().includes(name))
    }
    return ALL_CLUSTERS
  }
  return []
}

export function computeClusterStats(clusters: Cluster[]): ClusterStats {
  const totalGroups = clusters.length
  const totalConsumers = clusters.reduce((s, c) => s + c.members, 0)
  const totalConfirmed = clusters.reduce((s, c) => s + c.confirmed, 0)
  const totalPending = clusters.reduce((s, c) => s + c.pending, 0)
  const totalExposureNum = clusters.reduce((s, c) => s + (c.amountNum || 0), 0)
  const totalExposureStr = totalExposureNum > 0 ? `₹${(totalExposureNum / 100000).toFixed(1)}L` : '₹0'
  const largestGroup = clusters.length > 0 ? Math.max(...clusters.map((c) => c.members)) : 0
  const largestGroupName = clusters.find((c) => c.members === largestGroup)?.name.replace(/ Cluster$/, '') ?? ''
  return {
    totalGroups,
    totalConsumers,
    totalConfirmed,
    totalPending,
    totalExposureNum,
    totalExposureStr,
    largestGroup,
    largestGroupName,
  }
}

/** Status badge colours — matches the prototype badge mapping + screenshot. */
export function clusterStatusStyle(status: string): { label: string; bg: string; color: string } {
  switch (status) {
    case 'New cluster':
      return { label: 'New case', bg: 'rgba(23,162,184,0.12)', color: 'var(--teal, #17a2b8)' }
    case 'Active investigation':
      return { label: status, bg: 'rgba(230,146,30,0.12)', color: 'var(--amber)' }
    case 'All confirmed':
      return { label: status, bg: 'rgba(220,53,69,0.12)', color: 'var(--red)' }
    case 'Recovery phase':
      return { label: status, bg: 'rgba(40,167,69,0.12)', color: 'var(--green)' }
    default:
      return { label: status, bg: 'rgba(107,114,128,0.1)', color: 'var(--text-mid)' }
  }
}

/** Member card colours by status (matches prototype member cards). */
export function memberCardStyle(status: string): { bg: string; border: string; badgeBg: string; badgeColor: string } {
  if (status === 'Confirmed') {
    return { bg: 'var(--red-light)', border: 'var(--red)', badgeBg: 'rgba(220,53,69,0.12)', badgeColor: 'var(--red)' }
  }
  if (status === 'Under inspection') {
    return { bg: 'var(--amber-light)', border: 'var(--amber)', badgeBg: 'rgba(230,146,30,0.12)', badgeColor: 'var(--amber)' }
  }
  return { bg: 'var(--bg)', border: 'var(--navy-light, #64748b)', badgeBg: 'rgba(23,162,184,0.12)', badgeColor: 'var(--teal, #17a2b8)' }
}

/* ── Chart data (exact ports of the prototype's initClusterCharts algorithms) ── */

export const METHOD_LABELS = ['Earth Loading', 'Meter Bypass', 'CT Manipulation', 'Magnetic Tamper', 'Tariff Misuse', 'Direct Hooking']
export const METHOD_COLORS = ['#DC3545', '#E6921E', '#17A2B8', '#7C3AED', '#28A745', '#8B95A5']

const METHOD_MATCHERS: Record<string, RegExp> = {
  'Earth Loading': /earth\s*load/i,
  'Meter Bypass': /bypass/i,
  'CT Manipulation': /CT\s*manipul|CT\s*bypass|CT\s*tamper/i,
  'Magnetic Tamper': /magnetic/i,
  'Tariff Misuse': /tariff/i,
  'Direct Hooking': /direct\s*hook|hooking/i,
}

/** Sum members per theft-method bucket (splitting evenly across matched buckets). */
export function getMethodCounts(clusters: Cluster[]): number[] {
  return METHOD_LABELS.map((label) => {
    let total = 0
    clusters.forEach((c) => {
      const pat = c.pattern || ''
      const buckets = METHOD_LABELS.filter((b) => METHOD_MATCHERS[b].test(pat))
      if (buckets.length > 0 && buckets.includes(label)) {
        total += Math.round((c.members || 0) / buckets.length)
      }
    })
    return total
  })
}

export const TIMELINE_MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']

/** Cumulative "detected" and "resolved" case counts across the timeline. */
export function getTimelineData(clusters: Cluster[]): { detected: number[]; resolved: number[] } {
  const monthFromStarted = (s: string) => (s || '').split(' ')[0]
  const detected = TIMELINE_MONTHS.map((label) => clusters.filter((c) => monthFromStarted(c.started) === label).length)
  const cumDetected: number[] = []
  let acc = 0
  detected.forEach((d) => {
    acc += d
    cumDetected.push(acc)
  })
  const resolvedClusters = clusters.filter((c) => /confirmed|recovery/i.test(c.status || ''))
  const resolved = TIMELINE_MONTHS.map((_, i) =>
    i < 4 ? 0 : Math.round((resolvedClusters.length * (i - 3)) / (TIMELINE_MONTHS.length - 4)),
  )
  return { detected: cumDetected, resolved }
}

export const FEATURED_CASE_ID = 'CL-2026-042'
