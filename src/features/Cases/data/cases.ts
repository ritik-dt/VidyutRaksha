import { hierData } from '@/data/hierarchy'
import { enrichLevel, getChildLabel } from '@/shared/utils/level'
import { fmtINR } from '@/shared/utils/formatters'
import { formatIndian } from '@/shared/utils/formatters'
import type {
  CaseListSortKey,
  CaseRecord,
  CasesHierarchyRow,
  CasesStats,
  CasesWatchlistItem,
} from '../types'

export type { CaseListSortKey, CaseRecord, CasesHierarchyRow, CasesStats, CasesWatchlistItem }

/**
 * Meter → theft-type map (exact prototype). Exposed as getTheftType() so every
 * Reassign-inspector entry point (detail page, watchlist, drawer) derives the
 * same theft type for the shared ReassignInspectorPanel.
 */
const METER_THEFT_TYPE: Record<string, string> = {
  '1849966': 'Earth Loading',
  '2034871': 'Meter Bypass',
  '1567234': 'CT Manipulation',
  '1923445': 'Magnetic Tamper',
  '2187690': 'Earth Loading',
  '1678432': 'CT Manipulation',
  '1445567': 'Meter Bypass',
  '2098123': 'Neutral Disturbance',
}

export function getTheftType(meter: string): string {
  return METER_THEFT_TYPE[meter] ?? 'Meter Bypass'
}

const CASE_ANCHOR_DATE = new Date('2026-04-01T00:00:00.000Z')

const INSPECTOR_POOL = [
  'Rajesh Kumar',
  'Sunita Verma',
  'Amit Sharma',
  'Priya Singh',
  'Deepak Yadav',
  'Manish Gupta',
  'Vikash Patel',
  'Priya Mishra',
]

const WATCHLIST_CONSUMERS = [
  {
    name: 'M/S RAJESH STEEL INDUSTRIES',
    activity: 'Steel rolling mill',
    tariff: 'H21T',
    loadKW: 280,
  },
  {
    name: 'KAILASH CHANDRA SHARMA',
    activity: 'Atta Chakki',
    tariff: '22',
    loadKW: 32,
  },
  {
    name: 'SHRI BALAJI COLD STORAGE',
    activity: 'Cold storage',
    tariff: '47',
    loadKW: 165,
  },
  {
    name: 'M/S GUPTA TEXTILES',
    activity: 'Power loom',
    tariff: '68',
    loadKW: 48,
  },
  {
    name: 'SUNIL KUMAR YADAV',
    activity: 'Domestic',
    tariff: '10',
    loadKW: 6,
  },
  {
    name: 'AGRA AGROCHEM PVT LTD',
    activity: 'Chemical plant',
    tariff: 'H21T',
    loadKW: 420,
  },
  {
    name: 'HARI OM RICE MILL',
    activity: 'Rice mill',
    tariff: '22',
    loadKW: 95,
  },
  {
    name: 'ROYAL BANQUET HALL',
    activity: 'Banquet hall',
    tariff: '47',
    loadKW: 78,
  },
  {
    name: 'M/S SHARMA AUTO PARTS',
    activity: 'Manufacturing',
    tariff: '22',
    loadKW: 38,
  },
  {
    name: 'GRACE NURSING HOME',
    activity: 'Private hospital',
    tariff: '47',
    loadKW: 52,
  },
  {
    name: 'BANSAL OIL MILLS',
    activity: 'Oil mill',
    tariff: '22',
    loadKW: 110,
  },
  {
    name: 'JAY BHAVANI WAREHOUSE',
    activity: 'Warehouse',
    tariff: '47',
    loadKW: 28,
  },
]

function hashSeed(value: string): number {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function formatDateForDue(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function buildDueDate(offsetDays: number): string {
  const date = new Date(CASE_ANCHOR_DATE)
  date.setDate(date.getDate() + offsetDays)
  return formatDateForDue(date)
}

export const CASES_LIST: CaseRecord[] = [
  {
    id: 'C-20260301-001',
    meter: '1849966',
    consumer: 'HEERA LAL AGRAWAL',
    risk: 94,
    area: 'Bhelupur / EUDD-II Varanasi',
    status: 'Assigned',
    assignee: 'Rajesh Kumar',
    created: '01 Mar 2026',
    due: '15 Mar 2026',
    flags: 3,
    scopeId: 'dtr_vijaya',
    _real: true,
    _account: '1705463',
  },
  {
    id: 'C-20260228-014',
    meter: '2034871',
    consumer: 'R.K. ENTERPRISES',
    risk: 91,
    area: 'Gomti Nagar / EDD-I',
    status: 'In Progress',
    assignee: 'Sunita Verma',
    created: '28 Feb 2026',
    due: '14 Mar 2026',
    flags: 3,
    scopeId: 'dtr_ragh1',
  },
  {
    id: 'C-20260225-008',
    meter: '1567234',
    consumer: 'VINOD KUMAR',
    risk: 88,
    area: 'Alambagh / EDD-II',
    status: 'Confirmed Theft',
    assignee: 'Amit Sharma',
    created: '25 Feb 2026',
    due: '10 Mar 2026',
    flags: 3,
    scopeId: 'dtr_vijaya',
  },
  {
    id: 'C-20260220-022',
    meter: '1923445',
    consumer: 'SUSHILA DEVI',
    risk: 85,
    area: 'Indira Nagar / EDD-III',
    status: 'False Positive',
    assignee: 'Priya Singh',
    created: '20 Feb 2026',
    due: '06 Mar 2026',
    flags: 2,
    scopeId: 'dtr_rath1',
  },
  {
    id: 'C-20260218-005',
    meter: '2187690',
    consumer: 'M/S CHAWLA STEEL',
    risk: 82,
    area: 'Aliganj / EDD-I',
    status: 'Confirmed Theft',
    assignee: 'Deepak Yadav',
    created: '18 Feb 2026',
    due: '04 Mar 2026',
    flags: 2,
    scopeId: 'dtr_rath2',
  },
  {
    id: 'C-20260215-011',
    meter: '1678432',
    consumer: 'ANAND KUMAR',
    risk: 79,
    area: 'Hazratganj / EDD-II',
    status: 'Escalated',
    assignee: 'Manish Gupta',
    created: '15 Feb 2026',
    due: '01 Mar 2026',
    flags: 2,
    scopeId: 'dtr_ragh1',
  },
  {
    id: 'C-20260301-R415',
    meter: '300415',
    consumer: 'GANESH CONSUMER PRODUCTS LIMITED',
    risk: 82,
    area: 'EDD-I Chandauli / EDC Chandauli',
    status: 'In Progress',
    assignee: 'Vikash Patel',
    created: '05 Mar 2026',
    due: '19 Mar 2026',
    flags: 2,
    scopeId: 'f_bhelupur',
    _real: true,
    _account: '1924538000',
    _activity: 'Factory',
    _tariff: 'H21T',
    _load: 1000,
    _load_unit: 'KVA',
    _zone: 'Varanasi II',
  },
  {
    id: 'C-20260302-R160',
    meter: '895160',
    consumer: 'MRF CENTRE NAGAR PALIKA MALAKA',
    risk: 92,
    area: 'EDD-1 FATEHPUR / EDC Fatehpur',
    status: 'Assigned',
    assignee: 'Sunita Verma',
    created: '08 Mar 2026',
    due: '22 Mar 2026',
    flags: 2,
    scopeId: 'pvvnl_agra',
    _real: true,
    _account: '1589101174',
    _activity: 'Atta Chakki',
    _tariff: '22',
    _load: 48,
    _load_unit: 'KW',
    _zone: 'Prayagraj II',
  },
  {
    id: 'C-20260303-R945',
    meter: '302945',
    consumer: 'M/SRELIANCE JIO INFOCOMM LTD',
    risk: 89,
    area: 'EDD-II Ballia / EDC Ballia',
    status: 'Confirmed Theft',
    assignee: 'Manish Gupta',
    created: '11 Mar 2026',
    due: '25 Mar 2026',
    flags: 2,
    scopeId: 'dvvnl_prayagraj',
    _real: true,
    _account: '4775404000',
    _activity: 'Tower',
    _tariff: 'H21T',
    _load: 105,
    _load_unit: 'KVA',
    _zone: 'Azamgarh',
  },
  {
    id: 'C-20260304-R086',
    meter: '3917086',
    consumer: 'AKSHAY KAKKAR S/O RAJEEV KUMAR KAKKAR',
    risk: 90,
    area: 'MAYOHALL / EUDC-II Prayagraj',
    status: 'In Progress',
    assignee: 'Priya Mishra',
    created: '14 Mar 2026',
    due: '28 Mar 2026',
    flags: 2,
    scopeId: 'dvvnl_prayagraj',
    _real: true,
    _account: '5239803290',
    _activity: 'Hotel',
    _tariff: '22',
    _load: 45,
    _load_unit: 'KW',
    _zone: 'Prayagraj I',
  },
  {
    id: 'C-20260305-R758',
    meter: '3918758',
    consumer: 'JP MEMORIAL HOSPITAL REKHA NURSING CAMPUS',
    risk: 73,
    area: 'TAGORE TOWN / EUDC-II Prayagraj',
    status: 'Escalated',
    assignee: 'Vikash Patel',
    created: '17 Mar 2026',
    due: '31 Mar 2026',
    flags: 2,
    scopeId: 'dvvnl_prayagraj',
    _real: true,
    _account: '4165242403',
    _activity: 'Private Hospital',
    _tariff: '47',
    _load: 35,
    _load_unit: 'KW',
    _zone: 'Prayagraj I',
  },
  {
    id: 'C-20260306-R160',
    meter: '905160',
    consumer: 'NAJEER AHMAD',
    risk: 85,
    area: 'EDD Phaphamau / EDC-II Prayagraj',
    status: 'Confirmed Theft',
    assignee: 'Priya Mishra',
    created: '20 Mar 2026',
    due: '03 Apr 2026',
    flags: 2,
    scopeId: 'dvvnl_prayagraj',
    _real: true,
    _account: '3723500100',
    _activity: 'POWER LOOM',
    _tariff: '68',
    _load: 32,
    _load_unit: 'KVA',
    _zone: 'Prayagraj II',
  },
  {
    id: 'C-20260307-R093',
    meter: '1307093',
    consumer: 'SRI R KHOSELA',
    risk: 74,
    area: 'Karela Bagh / EUDC-I Prayagraj',
    status: 'In Progress',
    assignee: 'Vikash Patel',
    created: '23 Mar 2026',
    due: '06 Apr 2026',
    flags: 4,
    scopeId: 'dvvnl_prayagraj',
    _real: true,
    _account: '6865595000',
    _activity: 'Home',
    _tariff: '10',
    _load: 6,
    _load_unit: 'KW',
    _zone: 'Prayagraj I',
  },
  {
    id: 'C-20260308-R280',
    meter: '889280',
    consumer: 'SRI VIVEK KUMAR KESARI',
    risk: 73,
    area: 'EUDD-2 CHOKAGHAT / UEDC-I Varanasi',
    status: 'Assigned',
    assignee: 'Sunita Verma',
    created: '26 Mar 2026',
    due: '09 Apr 2026',
    flags: 4,
    scopeId: 'dtr_vijaya',
    _real: true,
    _account: '8499638473',
    _activity: 'Apartment',
    _tariff: '10',
    _load: 6,
    _load_unit: 'KW',
    _zone: 'Varanasi I',
  },
]

export const INSPECTORS = [...INSPECTOR_POOL]

export const CASE_STATUS_PILLS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All cases' },
  { value: 'Past SLA', label: 'Past SLA' },
  { value: 'Assigned', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Escalated', label: 'Escalated' },
  { value: 'Confirmed Theft', label: 'Confirmed' },
  { value: 'Closed', label: 'Closed' },
]

export function computeCasesStats(cases: CaseRecord[]): CasesStats {
  const active = cases.filter((c) => !['Closed', 'False Positive'].includes(c.status)).length

  return {
    total: cases.length,
    pastSla: cases.filter((c) => c.status === 'Past SLA').length + 3,
    open: cases.filter((c) => c.status === 'Assigned').length,
    inProgress: cases.filter((c) => ['In Progress', 'Escalated'].includes(c.status)).length,
    escalated: cases.filter((c) => c.status === 'Escalated').length,
    confirmed: cases.filter((c) => c.status === 'Confirmed Theft').length,
    closed: cases.filter((c) => c.status === 'Closed').length,
    avgClose: 3.2,
    recovery: 2845000,
    active,
  }
}

interface CaseStatsSource {
  openCases?: number
  flagged?: number
  loss?: number
}

/**
 * Core case-stats computation (exact prototype casesAtScope split). Works from
 * either a registered hierData level (openCases) or an inline child ref (flagged),
 * so every scope AND every child row can be computed with real data.
 */
function caseStatsFromSource(scopeId: string, source: CaseStatsSource): CasesStats {
  const totalCases = source.openCases ?? Math.round((source.flagged ?? 0) * 0.18)
  const seed = hashSeed(scopeId)
  const open = Math.round(totalCases * (0.28 + (seed % 4) / 100))
  const inProgress = Math.round(totalCases * (0.24 + ((seed >> 3) % 4) / 100))
  const escalated = Math.round(totalCases * (0.08 + ((seed >> 5) % 3) / 100))
  const confirmed = Math.round(totalCases * (0.22 + ((seed >> 7) % 4) / 100))
  const closed = Math.max(0, totalCases - open - inProgress - escalated - confirmed)
  const active = open + inProgress + escalated
  const pastSla = Math.round(active * (0.18 + ((seed >> 9) % 9) / 100))
  const avgClose = +(2.4 + (source.loss ?? 20) * 0.08 + ((seed >> 11) % 5) / 10).toFixed(1)
  const recovery = Math.round(confirmed * 600000 * 0.62)

  return {
    total: totalCases,
    pastSla,
    open,
    inProgress,
    escalated,
    confirmed,
    closed,
    avgClose,
    recovery,
    active,
  }
}

export function getCasesScopeStats(scopeId: string): CasesStats | null {
  const level = hierData[scopeId]
  if (!level) return null
  return caseStatsFromSource(scopeId, enrichLevel(level))
}

export function getCasesHierarchyRows(scopeId: string): CasesHierarchyRow[] {
  const scope = hierData[scopeId]
  if (!scope?.children?.length) return []

  return [...scope.children]
    .map((child) => {
      // The prototype registers every child in hierData, so each child row must
      // render with real data. Prefer a registered top-level node; otherwise
      // derive stats from the inline child (which carries flagged/loss). Rows are
      // never dropped — this is why the workload table populates at every level
      // (e.g. sub-divisions under EUDD Varunapar), matching the prototype.
      const registered = hierData[child.id]
      const source: CaseStatsSource = registered
        ? enrichLevel(registered)
        : (child as CaseStatsSource)
      const stats = caseStatsFromSource(child.id, source)

      return {
        id: child.id,
        name: child.name,
        type: registered?.type ?? 'Child',
        total: stats.total,
        pastSla: stats.pastSla,
        open: stats.open,
        inProgress: stats.inProgress,
        confirmed: stats.confirmed,
        avgClose: stats.avgClose,
        recovery: stats.recovery,
        topInspector: INSPECTOR_POOL[hashSeed(child.id) % INSPECTOR_POOL.length],
      } satisfies CasesHierarchyRow
    })
    .sort((a, b) => b.pastSla - a.pastSla || b.total - a.total)
}

const CONSUMER_POOL = [
  { name: 'RAMESH KUMAR GUPTA',       activity: 'Atta Chakki',       load: 32,  unit: 'KW'  },
  { name: 'SHIV SHAKTI INDUSTRIES',   activity: 'Manufacturing',      load: 85,  unit: 'KW'  },
  { name: 'MEERA DEVI',               activity: 'Domestic',           load: 6,   unit: 'KW'  },
  { name: 'KRISHNA COLD STORAGE',     activity: 'Cold storage',       load: 120, unit: 'KW'  },
  { name: 'AGARWAL RICE MILL',        activity: 'Rice mill',          load: 95,  unit: 'KW'  },
  { name: 'NATIONAL STEEL WORKS',     activity: 'Steel rolling mill', load: 220, unit: 'KW'  },
  { name: 'SUNRISE HOSPITAL PVT LTD', activity: 'Private hospital',   load: 48,  unit: 'KW'  },
  { name: 'PATEL TRADERS',            activity: 'Commercial',         load: 18,  unit: 'KW'  },
  { name: 'DURGA FLOUR MILL',         activity: 'Flour mill',         load: 42,  unit: 'KW'  },
  { name: 'CITY PALACE HOTEL',        activity: 'Hotel',              load: 65,  unit: 'KW'  },
  { name: 'MODERN TEXTILE MILLS',     activity: 'Power loom',         load: 55,  unit: 'KW'  },
  { name: 'SHREE RAM WAREHOUSE',      activity: 'Warehouse',          load: 24,  unit: 'KW'  },
  { name: 'BAJAJ CEMENT WORKS',       activity: 'Manufacturing',      load: 180, unit: 'KW'  },
  { name: 'SURESH OIL INDUSTRIES',    activity: 'Oil mill',           load: 88,  unit: 'KW'  },
  { name: 'JANTA BANQUET HALL',       activity: 'Banquet hall',       load: 70,  unit: 'KW'  },
  { name: 'NEW INDIA CHEMICALS',      activity: 'Chemical plant',     load: 380, unit: 'KW'  },
  { name: 'SHUBH LAXMI NURSING HOME', activity: 'Private hospital',   load: 38,  unit: 'KW'  },
  { name: 'HIMALAYA STEEL CORP',      activity: 'Steel rolling mill', load: 310, unit: 'KW'  },
  { name: 'VISHNU ENTERPRISES',       activity: 'Commercial',         load: 22,  unit: 'KW'  },
  { name: 'MOTHER DAIRY PLANT',       activity: 'Dairy',              load: 145, unit: 'KW'  },
]

const CASE_STATUSES: CaseRecord['status'][] = [
  'Assigned', 'In Progress', 'Escalated', 'Confirmed Theft', 'False Positive', 'Closed',
]

export function getCaseListRows(scopeId: string): CaseRecord[] {
  // Always include the 14 real + real-data records as prototype does
  const base = [...CASES_LIST]

  // Generate synthetic scope-specific rows to pad list (prototype note: same 14 everywhere)
  // We add synthetic rows so deeper scopes feel populated
  const scope = hierData[scopeId]
  if (!scope) return base

  const stats = getCasesScopeStats(scopeId)
  if (!stats) return base

  // Exact prototype seed for this scope
  let h = 0
  for (let ci = 0; ci < scopeId.length; ci++) {
    h = (h * 31 + scopeId.charCodeAt(ci)) | 0
  }
  const scopeSeed = Math.abs(h)

  // Build area pool from scope children or scope name
  const areaPool: string[] = scope.children?.length
    ? scope.children.map((ch: { name: string }) => ch.name)
    : [scope.name]

  // Generate up to 20 synthetic rows for this scope
  const synthCount = Math.min(20, Math.max(0, stats.total - base.length))
  const synthRows: CaseRecord[] = []

  for (let i = 0; i < synthCount; i++) {
    const s = Math.abs((scopeSeed + i * 137) | 0)
    const consumer  = CONSUMER_POOL[s % CONSUMER_POOL.length]
    const inspector = INSPECTOR_POOL[(s >> 3) % INSPECTOR_POOL.length]
    const area      = areaPool[(s >> 5) % areaPool.length]
    const risk      = 55 + (Math.abs(s >> 7) % 40)
    const offsetCreated = -(30 + (Math.abs(s >> 9) % 60))
    const offsetDue     = offsetCreated + (7 + (Math.abs(s >> 11) % 14))
    const status    = CASE_STATUSES[Math.abs(s >> 13) % CASE_STATUSES.length]
    const dayPart   = String(15 + (Math.abs(s >> 15) % 14)).padStart(2, '0')
    const idSuffix  = String(100 + (Math.abs(s >> 17) % 899)).padStart(3, '0')
    const meterId   = String(1000000 + (Math.abs(s >> 19) % 1000000))

    synthRows.push({
      id: `C-2026${dayPart}-${idSuffix}`,
      meter: meterId,
      consumer: consumer.name,
      risk,
      area,
      status,
      assignee: inspector,
      created: buildDueDate(offsetCreated),
      due: buildDueDate(offsetDue),
      flags: 1 + (Math.abs(s >> 21) % 4),
      scopeId,
      _activity: consumer.activity,
      _load: consumer.load,
      _load_unit: consumer.unit,
    })
  }

  // Merge: base first, then synthetic, deduplicate by id
  const seen = new Set<string>()
  const merged: CaseRecord[] = []
  for (const r of [...base, ...synthRows]) {
    if (!seen.has(r.id)) { seen.add(r.id); merged.push(r) }
  }

  // Sort by due date ascending (overdue first) matching prototype default
  return merged.sort((a, b) => {
    try { return +new Date(a.due) - +new Date(b.due) }
    catch { return 0 }
  })
}

export function getCasesWatchlist(scopeId: string, limit = 5): CasesWatchlistItem[] {
  const stats = getCasesScopeStats(scopeId)
  if (!stats || stats.pastSla <= 0) return []

  const scope = hierData[scopeId]

  // Build area pool from scope's children — exact prototype pattern
  const areaPool: string[] = []
  if (scope?.children?.length) {
    scope.children.forEach((ch: { name: string }) => areaPool.push(ch.name))
  } else {
    areaPool.push(scope?.name ?? 'Unknown area')
  }

  // ── EXACT PROTOTYPE SEED ALGORITHM ─────────────────────────────────────────
  // Prototype: let h = 0; for each char h = (h * 31 + charCode) | 0; seed = Math.abs(h)
  // Then per-entry: s = (seed + i * 137) | 0
  let h = 0
  for (let ci = 0; ci < scopeId.length; ci++) {
    h = (h * 31 + scopeId.charCodeAt(ci)) | 0
  }
  const scopeSeed = Math.abs(h)
  // ──────────────────────────────────────────────────────────────────────────

  const count = Math.min(limit, stats.pastSla)
  const entries: CasesWatchlistItem[] = []

  for (let i = 0; i < count; i++) {
    // exact prototype: s = (seed + i * 137) | 0
    const s = Math.abs((scopeSeed + i * 137) | 0)

    const consumer = WATCHLIST_CONSUMERS[s % WATCHLIST_CONSUMERS.length]
    const inspector = INSPECTOR_POOL[(s >> 3) % INSPECTOR_POOL.length]
    const area = areaPool[(s >> 5) % areaPool.length]
    const risk = 70 + (Math.abs(s >> 7) % 26)
    const overdueDays = 2 + (Math.abs(s >> 9) % 27)
    const valueScore = (risk / 50) * (1 + consumer.loadKW / 200)
    const estValue = Math.round(550000 * valueScore + (Math.abs(s >> 11) % 200000))
    const dayStr = String(15 + (Math.abs(s >> 13) % 14)).padStart(2, '0')
    const idSuffix = String(Math.abs(s >> 17) % 999).padStart(3, '0')
    const caseId = `C-2026${dayStr}-${idSuffix}`
    const meterId = String(1500000 + (Math.abs(s >> 19) % 500000))
    const statusPool: CaseRecord['status'][] = ['Assigned', 'In Progress', 'Escalated']
    const status = statusPool[Math.abs(s >> 21) % statusPool.length]

    entries.push({
      id: caseId,
      meter: meterId,
      consumer: consumer.name,
      area,
      assignee: inspector,
      status,
      risk,
      created: buildDueDate(-overdueDays - 12),
      due: buildDueDate(-overdueDays),
      flags: 2 + (Math.abs(s >> 7) % 3),
      scopeId,
      overdueDays,
      estValue,
      category: consumer.activity,
      _activity: consumer.activity,
      _load: consumer.loadKW,
      _load_unit: 'KW',
      _tariff: consumer.tariff,
      urgency: (overdueDays * estValue) / 100000,
      _synth: true,
    } as CasesWatchlistItem)
  }

  return entries.sort((a, b) => (b.urgency ?? 0) - (a.urgency ?? 0))
}

export function getCaseStatusLabel(statusFilter: string): string {
  switch (statusFilter) {
    case 'Past SLA':
      return 'Showing Past SLA cases'
    case 'Assigned':
      return 'Showing Open (assigned) cases'
    case 'In Progress':
      return 'Showing In progress cases'
    case 'Confirmed Theft':
      return 'Showing Confirmed cases'
    case 'Closed':
      return 'Showing Closed cases'
    case 'Escalated':
      return 'Showing Escalated cases'
    default:
      return 'All cases at this scope'
  }
}

export function getCasesClosureTrend(scopeId: string, avgClose: number): Array<{ month: string; avgDays: number }> {
  // Exact prototype seed: h = (h * 31 + charCode) | 0, then Math.abs(h)
  let h = 0
  for (let ci = 0; ci < scopeId.length; ci++) {
    h = (h * 31 + scopeId.charCodeAt(ci)) | 0
  }
  const seed = Math.abs(h)
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
  const startVal = avgClose + 1.4
  const endVal = avgClose
  return months.map((month, index) => {
    const t = index / (months.length - 1)
    const linear = startVal + (endVal - startVal) * t
    const noise = (((seed >> (index % 12)) % 7) - 3) * 0.08
    return { month, avgDays: +(linear + noise).toFixed(2) }
  })
}

export function getCasesChartData(stats: CasesStats) {
  return [
    { label: 'Past SLA', value: stats.pastSla, color: '#FF4757' },
    { label: 'Open', value: stats.open, color: '#0EA5E9' },
    { label: 'In progress', value: stats.inProgress, color: '#FFA502' },
    { label: 'Confirmed', value: stats.confirmed, color: '#28A745' },
    { label: 'Closed/FP', value: stats.closed, color: '#9CA3AF' },
  ]
}

export { getChildLabel, fmtINR, formatIndian }
