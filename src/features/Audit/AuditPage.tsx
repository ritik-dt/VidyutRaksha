import { useNavigate } from 'react-router-dom'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { AuditKpiRow } from './components/AuditKpiRow'
import { EvidencePackCard } from './components/EvidencePackCard'
import { RoleActivityLog } from './components/RoleActivityLog'
import { StaticAuditTable } from './components/StaticAuditTable'
import { useAudit } from './hooks/useAudit'

/**
 * Audit trail — a tamper-proof log of every action, compliance-ready for
 * Section 135 proceedings.
 *
 * Faithful to the prototype's renderAudit(). Two logs live here:
 *   1. the static, SHA-256-signed compliance log, and
 *   2. the LIVE "Role activity log", fed by every module through
 *      ActivityLogContext and filtered by the active role's visibility scope —
 *      an AEN sees only their own actions, a CMD sees everything.
 */
export default function AuditPage() {
  const a = useAudit()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="📝 Audit trail"
        subtitle="Tamper-proof log of every action — compliance-ready for Section 135 proceedings"
        actions={
          <>
            <input
              className="form-input aud-search"
              placeholder="Search logs..."
              value={a.search}
              onChange={(e) => a.setSearch(e.target.value)}
              aria-label="Search audit logs"
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                showToast({
                  type: 'success',
                  title: 'Audit log exported',
                  message:
                    'Signed CSV + PDF exported with the full SHA-256 hash chain for legal submission.',
                  duration: 4000,
                })
                logActivity('Exported audit log', 'audit')
              }}
            >
              Export
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => {
                showToast({
                  type: 'ai',
                  title: '✦ Anomaly scan complete',
                  message:
                    'Scanned all logged actions for privilege escalation, unusual hours, and bulk edits. No anomalies detected.',
                  duration: 4000,
                })
                logActivity('Ran AI anomaly scan', 'audit')
              }}
            >
              ✦ AI anomaly scan
            </button>
          </>
        }
      />

      <AiInsightBanner title={a.aiInsight.title} className="mb-[14px]">
        <span dangerouslySetInnerHTML={{ __html: a.aiInsight.bodyHtml }} />
      </AiInsightBanner>

      <AuditKpiRow kpis={a.kpis} onNavigate={() => navigate('/cases')} />

      <EvidencePackCard
        tiles={a.evidenceTiles}
        caseLabel={a.evidenceCase}
        onVerifyChain={() =>
          showToast({
            type: 'success',
            title: 'Chain verified',
            message:
              'All 6 artefacts hash-match the recorded chain. Integrity 100% — admissible under Section 135.',
            duration: 4000,
          })
        }
        onDownload={() => {
          showToast({
            type: 'success',
            title: 'Evidence pack downloaded',
            message: `Signed ZIP for ${a.evidenceCase} — 6 artefacts with SHA-256 manifest.`,
            duration: 4000,
          })
          logActivity('Downloaded evidence pack', 'audit', a.evidenceCase)
        }}
      />

      <StaticAuditTable rows={a.auditLog} />

      <RoleActivityLog
        rows={a.activityRows}
        visibleCount={a.visibleCount}
        totalCount={a.totalCount}
        blurb={a.visibilityBlurb}
      />
    </div>
  )
}
