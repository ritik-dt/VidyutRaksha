import type {
  Photo,
  PhotoCapability,
  PhotoFilter,
  PhotoFilterId,
  PhotoStats,
  PhotoTab,
} from '../types'

/**
 * Evidence photos — mirrors the prototype's photos array exactly (P-842 → P-837).
 * API-ready: replace this array (keeping the shape) with a live feed later.
 */
export const PHOTOS: Photo[] = [
  { id: 'P-842', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Tamper seal', date: '07 Mar 2026 12:15', inspector: 'Rajesh Kumar', aiConf: 96, tags: ['seal', 'broken', 'earth_wire'], verified: true, gps: '25.3176° N, 82.9739° E' },
  { id: 'P-841', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Meter body', date: '07 Mar 2026 12:18', inspector: 'Rajesh Kumar', aiConf: 92, tags: ['meter', 'serial_visible'], verified: true, gps: '25.3176° N, 82.9739° E' },
  { id: 'P-840', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Earth wire', date: '07 Mar 2026 12:22', inspector: 'Rajesh Kumar', aiConf: 98, tags: ['earth_wire', 'tamper', 'evidence'], verified: true, gps: '25.3176° N, 82.9739° E' },
  { id: 'P-839', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', type: 'Panel close-up', date: '07 Mar 2026 12:25', inspector: 'Rajesh Kumar', aiConf: 88, tags: ['panel', 'wiring'], verified: true, gps: '25.3176° N, 82.9739° E' },
  { id: 'P-838', case: 'C-20260310-015', consumer: 'BHUWAL JAISWAL', type: 'Meter bypass', date: '10 Mar 2026 14:08', inspector: 'Amit Singh', aiConf: 94, tags: ['bypass', 'direct_connection'], verified: true, gps: '25.3180° N, 82.9745° E' },
  { id: 'P-837', case: 'C-20260315-020', consumer: 'M/S AGRAUTO', type: 'Premises', date: '15 Mar 2026 10:42', inspector: 'Sunita Verma', aiConf: 72, tags: ['premises', 'industrial'], verified: false, gps: '25.3210° N, 82.9801° E', flag: 'AI: may need additional angles' },
]

/** Tag chip color cycle — matches the prototype's `colors` array. */
export const TAG_COLORS = ['#DC3545', '#E6921E', '#17A2B8', '#7C3AED', '#28A745', '#8B95A5']

/** Filter tabs — matches the prototype's .filter-row. */
export const PHOTO_TABS: PhotoTab[] = [
  { id: 'all', label: 'All photos' },
  { id: 'tamper', label: 'Tamper evidence' },
  { id: 'meter', label: 'Meter body' },
  { id: 'panel', label: 'Panel close-up' },
  { id: 'premises', label: 'Consumer premises' },
  { id: 'review', label: 'Needs review' },
]

/**
 * AI photo capabilities — the 6 items listed in the prototype's right panel.
 * The prototype hard-codes these; kept as data so a future API can replace them.
 */
export const PHOTO_CAPABILITIES: PhotoCapability[] = [
  { icon: '🏷️', name: 'Auto-tagging', description: 'Detects seal, earth wire, tamper, meter body, panel, consumer face' },
  { icon: '✓', name: 'Tamper verification', description: 'Confirms visible tamper evidence in photo with confidence score' },
  { icon: '🔍', name: 'Quality check', description: 'Flags blurry, poorly lit, or incomplete-angle photos for re-capture' },
  { icon: '🔐', name: 'Metadata validation', description: 'Verifies EXIF data — timestamp, GPS, device ID for legal admissibility' },
  { icon: '👤', name: 'Face blurring', description: 'Optional redaction of faces before external sharing / court filing' },
  { icon: '📐', name: 'Completeness check', description: 'Compares captured photos to required angles for theft-type; flags missing' },
]

/**
 * Before/after evidence pair (Case C-20260301-001) — matches the prototype's
 * demo. Kept in data so a future API can supply the actual image URLs later.
 */
export interface BeforeAfterPair {
  beforeDate: string
  afterDate: string
  comparisonHtml: string
}

export const BEFORE_AFTER: BeforeAfterPair = {
  beforeDate: '07 Mar 2026 12:15',
  afterDate: '07 Mar 2026 13:40',
  comparisonHtml:
    '<strong>AI comparison:</strong> Meter body unchanged (serial 1849966 verified). Tamper wire removed. New seal applied (seal ID MR-78421). Panel closed. <strong>Evidence chain complete for court filing.</strong>',
}

/**
 * KPI values — hardcoded in the prototype (they describe a broader set than
 * the 6 sample photos rendered). Kept here so a future API can replace them.
 */
export const PHOTO_STATS: PhotoStats = {
  qualityRejections: 18,
  todayUploaded: 42,
  todayCases: 8,
  aiAvgConfidence: 94,
  needsReview: 5,
  missingPhotos: 2,
}

/** Map a filter tab to the set of photos it matches (based on prototype types). */
export function filterPhotos(
  photos: Photo[],
  activeTab: PhotoFilterId,
  filter: PhotoFilter,
): Photo[] {
  let out = photos
  switch (activeTab) {
    case 'tamper':
      out = out.filter((p) => /tamper|earth wire|meter bypass/i.test(p.type))
      break
    case 'meter':
      out = out.filter((p) => /meter body/i.test(p.type))
      break
    case 'panel':
      out = out.filter((p) => /panel/i.test(p.type))
      break
    case 'premises':
      out = out.filter((p) => /premises/i.test(p.type))
      break
    case 'review':
      out = out.filter((p) => !p.verified)
      break
    default:
      break
  }
  if (filter.filter === 'rejected') out = out.filter((p) => !p.verified)
  if (filter.status === 'flagged') out = out.filter((p) => Boolean(p.flag) || !p.verified)
  return out
}
