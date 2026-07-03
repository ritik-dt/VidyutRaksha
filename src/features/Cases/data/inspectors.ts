/**
 * Inspector directory + fit-scoring — exact port of prototype's INSPECTORS
 * array and scoreInspector()/scoreReason()/inspectorCovers() functions.
 * Used by the "Reassign inspector" side panel on the case detail page.
 */

export interface Inspector {
  id: string
  name: string
  init: string
  zone: string
  areas: string[]
  skills: string[]
  openCases: number
  pastSla: number
  capacity: number
  status: 'field' | 'office' | 'leave'
  statusDetail: string
  hitRate: number
  avgClose: number
}

/* ── exact prototype INSPECTORS ── */
export const INSPECTOR_DIRECTORY: Inspector[] = [
  {
    id: 'rk', name: 'Rajesh Kumar', init: 'RK', zone: 'Chowk',
    areas: ['Chowk', 'Bhelupur'],
    skills: ['earth_loading', 'bypass', 'ct_manipulation'],
    openCases: 18, pastSla: 3, capacity: 20, status: 'field',
    statusDetail: 'At meter #2193 (Chowk)', hitRate: 68.4, avgClose: 2.8,
  },
  {
    id: 'as', name: 'Amit Singh', init: 'AS', zone: 'Residency',
    areas: ['Residency', 'Hazratganj'],
    skills: ['bypass', 'tariff_misuse', 'tamper_seal'],
    openCases: 14, pastSla: 1, capacity: 20, status: 'field',
    statusDetail: 'En route to Residency', hitRate: 62.9, avgClose: 3.2,
  },
  {
    id: 'sv', name: 'Sunita Verma', init: 'SV', zone: 'Gomti Nagar',
    areas: ['Gomti Nagar', 'Indira Nagar'],
    skills: ['earth_loading', 'direct_hooking', 'bypass'],
    openCases: 22, pastSla: 5, capacity: 20, status: 'office',
    statusDetail: 'Report filing', hitRate: 60.0, avgClose: 3.8,
  },
  {
    id: 'vy', name: 'Vikram Yadav', init: 'VY', zone: 'Mahanagar',
    areas: ['Mahanagar', 'Aliganj'],
    skills: ['ct_manipulation', 'magnetic_tamper', 'direct_hooking'],
    openCases: 12, pastSla: 0, capacity: 20, status: 'field',
    statusDetail: 'Inspecting DT-0445', hitRate: 58.1, avgClose: 4.1,
  },
  {
    id: 'pm', name: 'Priya Mishra', init: 'PM', zone: 'Bhelupur',
    areas: ['Bhelupur', 'Chowk', 'Varanasi Central'],
    skills: ['earth_loading', 'bypass', 'photo_documentation'],
    openCases: 4, pastSla: 0, capacity: 20, status: 'office',
    statusDetail: 'Available — low workload', hitRate: 54.2, avgClose: 4.5,
  },
  {
    id: 'rt', name: 'Ramesh Tiwari', init: 'RT', zone: 'Chauk',
    areas: ['Chauk', 'Sigra'],
    skills: ['tariff_misuse', 'bypass'],
    openCases: 16, pastSla: 2, capacity: 20, status: 'leave',
    statusDetail: 'On leave till Apr 25', hitRate: 46.2, avgClose: 5.2,
  },
  {
    id: 'nd', name: 'Naveen Dubey', init: 'ND', zone: 'Lahurabir',
    areas: ['Lahurabir', 'Sigra'],
    skills: ['magnetic_tamper', 'tamper_seal', 'photo_documentation'],
    openCases: 8, pastSla: 0, capacity: 20, status: 'office',
    statusDetail: 'Available', hitRate: 57.9, avgClose: 3.6,
  },
  {
    id: 'ss', name: 'Shalini Sharma', init: 'SS', zone: 'Bhelupur',
    areas: ['Bhelupur', 'Varanasi Central'],
    skills: ['earth_loading', 'ct_manipulation', 'appeal_handling'],
    openCases: 10, pastSla: 1, capacity: 20, status: 'field',
    statusDetail: 'Follow-up visit', hitRate: 63.6, avgClose: 3.1,
  },
]

/* ── theft-type → required skill map — exact prototype theftTypeSkill() ── */
const THEFT_TYPE_SKILL: Record<string, string> = {
  'Meter Bypass': 'bypass',
  'Earth Loading': 'earth_loading',
  'Tariff Misuse': 'tariff_misuse',
  'CT Manipulation': 'ct_manipulation',
  'Magnetic Tamper': 'magnetic_tamper',
  'Direct Hooking': 'direct_hooking',
  'Tamper Seal': 'tamper_seal',
}

/* ── exact prototype inspectorCovers() ── */
export function inspectorCovers(inspector: Inspector, caseArea: string): boolean {
  if (!caseArea) return false
  const area = caseArea.toLowerCase()
  return inspector.areas.some((a) => area.includes(a.toLowerCase()) || a.toLowerCase().includes(area))
}

export interface InspectorCaseContext {
  area: string
  theftType: string
}

/* ── exact prototype scoreInspector() ── */
export function scoreInspector(inspector: Inspector, ctx: InspectorCaseContext): number {
  const util = inspector.openCases / inspector.capacity
  const availScore = util >= 1 ? 0 : Math.round(40 * (1 - util))
  const areaFit = inspectorCovers(inspector, ctx.area) ? 20 : 0
  const reqSkill = THEFT_TYPE_SKILL[ctx.theftType]
  const skillFit = reqSkill && inspector.skills.includes(reqSkill) ? 15 : 0
  const perfScore = Math.min(15, Math.round((inspector.hitRate / 70) * 15))
  const statusPenalty = inspector.status === 'leave' ? -50 : 0
  const slaPenalty = -Math.min(15, inspector.pastSla * 3)
  const raw = availScore + areaFit + skillFit + perfScore + statusPenalty + slaPenalty
  return Math.max(0, Math.min(100, raw))
}

/* ── exact prototype scoreReason() ── */
export function scoreReason(inspector: Inspector, ctx: InspectorCaseContext): string {
  const reasons: string[] = []
  const util = inspector.openCases / inspector.capacity
  if (util < 0.4) reasons.push(`Low workload (${Math.round(util * 100)}%)`)
  else if (util < 0.75) reasons.push(`Balanced load (${Math.round(util * 100)}%)`)
  else if (util < 1) reasons.push(`Near capacity (${Math.round(util * 100)}%)`)
  else reasons.push(`Overloaded (${Math.round(util * 100)}%)`)
  if (inspectorCovers(inspector, ctx.area)) reasons.push(`covers ${ctx.area}`)
  const reqSkill = THEFT_TYPE_SKILL[ctx.theftType]
  if (reqSkill && inspector.skills.includes(reqSkill)) reasons.push(`${ctx.theftType} expert`)
  if (inspector.status === 'leave') reasons.unshift('⚠ ON LEAVE')
  if (inspector.pastSla > 2) reasons.push(`${inspector.pastSla} overdue`)
  return reasons.join(' · ')
}

export interface RankedInspector extends Inspector {
  score: number
  reason: string
}

export function rankInspectors(ctx: InspectorCaseContext): RankedInspector[] {
  return INSPECTOR_DIRECTORY
    .map((i) => ({ ...i, score: scoreInspector(i, ctx), reason: scoreReason(i, ctx) }))
    .sort((a, b) => b.score - a.score)
}
