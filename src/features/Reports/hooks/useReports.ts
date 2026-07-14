// ── useReports (sole API seam) ───────────────────────────────────────────────
// Every data slice the Reports page needs. Reports is state-level and NOT
// scope-reactive (the prototype does no scope filtering here). Swapping mock
// data for a live API is a one-file change; the type surface and component tree
// stay identical.

import { useMemo } from 'react'
import { REPORTS_AI_INSIGHT } from '../data/aiInsight'
import { ADHOC_REPORTS, REPORT_TEMPLATES } from '../data/adhocTemplates'
import { INTERNAL_REPORTS } from '../data/internal'
import { STATUTORY_REPORTS } from '../data/statutory'
import { buildGlanceTiles, sortStatutoryByUrgency } from '../logic/reportStats'

export function useReports() {
  const statutory = useMemo(() => sortStatutoryByUrgency(STATUTORY_REPORTS), [])
  const glanceTiles = useMemo(
    () => buildGlanceTiles(INTERNAL_REPORTS, STATUTORY_REPORTS, ADHOC_REPORTS),
    [],
  )

  return {
    glanceTiles,
    statutory,
    internal: INTERNAL_REPORTS,
    adhoc: ADHOC_REPORTS,
    templates: REPORT_TEMPLATES,
    aiInsight: REPORTS_AI_INSIGHT,

    loading: false as const,
    error: null,
  }
}
