// ── useReportModal ───────────────────────────────────────────────────────────
// Ports the prototype's openReport(): resolve an id against the full report
// defs first, then the stub previews, else "not found". The daily-theft report
// is built on demand because two of its sections compute from live data.

import { useCallback, useEffect, useState } from 'react'
import { buildDailyTheftReport } from '../data/dailyTheftReport'
import { STATIC_REPORT_DEFS } from '../data/reportDefs'
import { REPORT_STUBS } from '../data/reportStubs'
import { computeDailyTheftMetrics } from '../logic/dailyTheftMetrics'
import type { ReportId, ResolvedReport } from '../types'

export function resolveReport(id: ReportId): ResolvedReport {
  if (id === 'rep-daily-theft') {
    return { kind: 'full', def: buildDailyTheftReport(computeDailyTheftMetrics()) }
  }
  const def = STATIC_REPORT_DEFS[id]
  if (def) return { kind: 'full', def }

  const stub = REPORT_STUBS[id]
  if (stub) return { kind: 'stub', stub }

  return { kind: 'missing' }
}

export function useReportModal() {
  const [openId, setOpenId] = useState<ReportId | null>(null)

  const open = useCallback((id: ReportId) => setOpenId(id), [])
  const close = useCallback(() => setOpenId(null), [])

  // Close on Escape
  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, close])

  const resolved: ResolvedReport | null = openId ? resolveReport(openId) : null

  return { openId, resolved, open, close }
}
