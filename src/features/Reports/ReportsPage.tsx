import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { AdhocList } from './components/AdhocList'
import { InternalReportsTable } from './components/InternalReportsTable'
import { ReportModal } from './components/ReportModal'
import { ReportsAiInsight } from './components/ReportsAiInsight'
import { ReportsGlanceStrip } from './components/ReportsGlanceStrip'
import { SectionHeaderRow } from './components/SectionHeaderRow'
import { StatutoryList } from './components/StatutoryList'
import { TemplatesList } from './components/TemplatesList'
import { useReportModal } from './hooks/useReportModal'
import { useReports } from './hooks/useReports'

/**
 * Reports — statutory filings, scheduled internal reports, ad-hoc saved queries,
 * and the templates library, plus the report-viewer modal.
 *
 * Faithful to the prototype's renderReports(): state-level, NOT scope-reactive.
 * All data is prop-driven from useReports; useReportModal is the sole resolver
 * for the 22 report ids (12 full documents + 10 stub previews).
 */
export default function ReportsPage() {
  const reports = useReports()
  const modal = useReportModal()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const navigate = useNavigate()

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="📄 Reports"
        subtitle={
          <>
            Statutory filings · scheduled internal · ad-hoc queries · templates
            <span className="rep-live-line">
              <span className="rep-live-badge">
                <span className="rep-live-dot" />
                <strong className="rep-live-text">LIVE</strong>
              </span>
              <span className="rep-live-sep">·</span>
              <span>
                Last batch <strong>06 May 2026, 06:00 IST</strong>
              </span>
              <span className="rep-live-sep">·</span>
              <span className="rep-live-dim">Auto-runs check at 06:00, 14:00, 22:00 IST</span>
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'New scheduled report',
                  message: 'Report builder will open. Fill name, frequency, recipients, format.',
                })
              }
            >
              + Schedule report
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: '✦ AI report generator',
                  message:
                    'Describe what you need in plain English. AI will compose query, generate report, and offer to schedule.',
                })
              }
            >
              ✦ Generate now
            </button>
          </>
        }
      />

      <ReportsGlanceStrip tiles={reports.glanceTiles} />

      {/* Section A · statutory & regulatory */}
      <SectionHeaderRow
        color="var(--red)"
        label="⚖️ Statutory & regulatory · file-or-fine"
        note="Ranked by days remaining"
      />
      <StatutoryList
        reports={reports.statutory}
        onOpen={modal.open}
        onChecklist={(r) =>
          showToast({
            type: 'info',
            title: 'Filing checklist',
            message: `${r.name} — pre-filing checklist with required attachments + officer sign-offs.`,
            duration: 3500,
          })
        }
      />

      {/* Section B · scheduled internal */}
      <SectionHeaderRow
        color="var(--ai-purple)"
        label="📨 Scheduled internal reports"
        note="Auto-generated & routed"
      />
      <InternalReportsTable
        reports={reports.internal}
        onRun={modal.open}
        onEdit={(r) =>
          showToast({
            type: 'info',
            title: 'Schedule edited',
            message: `${r.name} — opening configuration panel.`,
            duration: 3000,
          })
        }
      />

      {/* Sections C + D · ad-hoc + templates */}
      <div className="rep-cd-grid">
        <div>
          <SectionHeaderRow color="var(--teal)" label="🔍 Recent ad-hoc reports" />
          <AdhocList
            reports={reports.adhoc}
            onRun={modal.open}
            onSave={() =>
              showToast({
                type: 'info',
                title: 'Saved as scheduled',
                message: 'Query saved as a scheduled report. Configure frequency & recipients.',
                duration: 3500,
              })
            }
          />
        </div>
        <div>
          <SectionHeaderRow color="var(--id-text)" label="📋 Templates" />
          <TemplatesList templates={reports.templates} onOpen={modal.open} />
        </div>
      </div>

      {/* AI insight footer */}
      <ReportsAiInsight
        insight={reports.aiInsight}
        onOpenCea={() => modal.open('rep-cea-reliability')}
        onGoExecutive={() => navigate('/executive')}
      />

      {/* Report viewer */}
      <ReportModal
        resolved={modal.resolved}
        onClose={modal.close}
        onExportPdf={() => {
          modal.close()
          showToast({
            type: 'success',
            title: 'Report exported',
            message:
              'Signed PDF saved & routed to all configured recipients. Audit trail logged.',
            duration: 4500,
          })
          logActivity('Exported signed report', 'reports', modal.openId ?? '—')
        }}
        onGenerate={() => {
          modal.close()
          showToast({
            type: 'success',
            title: 'Report generated',
            message: 'Saved & routed to configured recipients.',
            duration: 4000,
          })
        }}
      />
    </div>
  )
}
