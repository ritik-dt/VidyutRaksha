// ── Inspector-case generator (Layer 1b) ──────────────────────────────────────
// Byte-identical port of the prototype's getInspectorCases(insp) helper
// (line ~3982). Uses the same LCG (Linear Congruential Generator) so a given
// inspector always yields the same synthetic case list across re-renders.

import type { Inspector } from '@/features/Cases/data/inspectors'
import type { InspectorGeneratedCase } from '../types'

const CONSUMERS = [
  'HEERA LAL AGRAWAL', 'R.K. ENTERPRISES', 'VINOD KUMAR', 'SUSHILA DEVI',
  'M/S CHAWLA STEEL', 'ANAND KUMAR', 'RAMA SHANKAR', 'POOJA GUPTA',
  'M/S PRECISION TOOLS', 'MOHD. ASLAM', 'JASBIR SINGH', 'DEEPAK SAHU',
  'M/S RAVI TEXTILES', 'SUNITA TIWARI', 'RAJ KUMAR YADAV', 'M/S NEW INDIA AGENCIES',
  'ASHOK GUPTA', 'RITU MISHRA', 'SANJAY VERMA', 'VIJAY PRATAP',
  'MEENA DEVI', 'RAVINDRA NATH', 'M/S CITY ELECTRONICS', 'HARI PRAKASH',
]
const THEFT_TYPES = [
  'Earth Loading', 'Meter Bypass', 'Tariff Misuse', 'CT Manipulation',
  'Direct Hooking', 'Magnetic Tamper', 'Tamper Seal',
]
const STATUSES = ['Assigned', 'In Progress', 'Field Inspection', 'In Progress', 'Assigned']

// Prototype's "today" — 23 Apr 2026 (month index 3).
const TODAY_YEAR = 2026
const TODAY_MONTH = 3
const TODAY_DATE = 23

/** Format a Date as prototype's `en-IN` `{day:'2-digit', month:'short', year:'numeric'}`. */
function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Deterministic per-inspector case list. Mirrors prototype getInspectorCases()
 * — same seed, same LCG, same field ordering.
 */
export function getInspectorCases(insp: Inspector): InspectorGeneratedCase[] {
  const inspId = insp.id
  // Seed = charCode(id[0]) * 31 + charCode(id[1])
  let seed = inspId.charCodeAt(0) * 31 + (inspId.charCodeAt(1) || 0)
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  const today = new Date(TODAY_YEAR, TODAY_MONTH, TODAY_DATE)
  const overdueCount = insp.pastSla
  const cases: InspectorGeneratedCase[] = []

  for (let i = 0; i < insp.openCases; i++) {
    const isOverdue = i < overdueCount
    const meter = (1500000 + Math.floor(rand() * 700000)).toString()
    const consumer = CONSUMERS[Math.floor(rand() * CONSUMERS.length)]
    const area = insp.areas[Math.floor(rand() * insp.areas.length)]
    const theftType = THEFT_TYPES[Math.floor(rand() * THEFT_TYPES.length)]
    const risk = 60 + Math.floor(rand() * 40)
    const dueOffset = isOverdue ? -(2 + Math.floor(rand() * 6)) : (1 + Math.floor(rand() * 8))
    const due = new Date(today); due.setDate(due.getDate() + dueOffset)
    const dueStr = fmtDate(due)
    const createdOffset = -(8 + Math.floor(rand() * 14))
    const created = new Date(today); created.setDate(created.getDate() + createdOffset)
    const createdStr = fmtDate(created)
    // ID: exact port of prototype's expression (including its quirky month clamp)
    const monthPart = today.getMonth() + 1 + createdOffset > 0
      ? today.getMonth() + 1
      : Math.max(1, today.getMonth())
    const id =
      'C-2026' +
      String(monthPart).padStart(2, '0') +
      String(15 + i).padStart(2, '0') +
      '-' +
      String(100 + Math.floor(rand() * 900)).padStart(3, '0')

    cases.push({
      id,
      meter,
      consumer,
      area,
      theftType,
      risk,
      status: isOverdue ? 'Past SLA' : STATUSES[Math.floor(rand() * STATUSES.length)],
      due: dueStr,
      created: createdStr,
      isOverdue,
    })
  }

  // Sort: overdue first, then risk desc (prototype line ~4028)
  cases.sort((a, b) => {
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
    return b.risk - a.risk
  })
  return cases
}
