// ── useAudit (sole API seam) ─────────────────────────────────────────────────
// The static compliance log plus the LIVE role-scoped activity feed.
//
// The live feed comes from ActivityLogContext (which every module writes to)
// and is filtered through the role's visibility scope — so what an AEN sees is
// genuinely narrower than what the CMD sees.

import { useCallback, useMemo, useState } from 'react'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useRole } from '@/shared/context/RoleContext'
import { AUDIT_AI_INSIGHT } from '../data/aiInsight'
import { AUDIT_LOG } from '../data/auditLog'
import { EVIDENCE_CASE, EVIDENCE_TILES } from '../data/evidencePack'
import { AUDIT_KPIS } from '../data/kpis'
import {
  ACTIVITY_LOG_LIMIT,
  getVisibleAuditEntries,
  searchAuditLog,
  visibilityBlurb,
} from '../logic/auditVisibility'

export function useAudit() {
  const { currentRole } = useRole()
  const { entries } = useActivityLog()
  const [search, setSearch] = useState('')

  /** Static compliance log, narrowed by the search box. */
  const auditLog = useMemo(() => searchAuditLog(AUDIT_LOG, search), [search])

  /** Live activity entries this role is permitted to see. */
  const visibleEntries = useMemo(
    () => getVisibleAuditEntries(entries, currentRole.id),
    [entries, currentRole.id],
  )

  /** The prototype renders at most 30 rows. */
  const activityRows = useMemo(
    () => visibleEntries.slice(0, ACTIVITY_LOG_LIMIT),
    [visibleEntries],
  )

  const clearSearch = useCallback(() => setSearch(''), [])

  return {
    // static compliance log
    auditLog,
    search,
    setSearch,
    clearSearch,

    // live, role-scoped activity feed
    activityRows,
    visibleCount: visibleEntries.length,
    totalCount: entries.length,
    visibilityBlurb: visibilityBlurb(currentRole.id),
    role: currentRole,

    // static panels
    kpis: AUDIT_KPIS,
    evidenceTiles: EVIDENCE_TILES,
    evidenceCase: EVIDENCE_CASE,
    aiInsight: AUDIT_AI_INSIGHT,

    loading: false as const,
    error: null,
  }
}
