import { useRef, useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/shared/utils/formatters'
import { DiagnosticDetailPanel } from './components/DiagnosticDetailPanel'
import { DiagnosticReportCard } from './components/DiagnosticReportCard'
import { ScopePill } from '@/shared/components/ui/ScopePill'
import { useDiagnosticsScope } from './hooks/useDiagnosticsScope'

export default function DiagnosticsPage() {
  const { toggleScopePicker } = useScope()
  const { showToast } = useToast()
  const {
    scopeId,
    scopeName,
    isStateLevel,
    currentRole,
    reports,
    highPriority,
    mediumPriority,
    criticalCount,
    totalAffected,
    totalImpact,
    trendingUp,
  } = useDiagnosticsScope()
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const critSectionRef = useRef<HTMLDivElement>(null)
  const medSectionRef = useRef<HTMLDivElement>(null)

  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? null
  const trendingText =
    trendingUp.length > 0
      ? trendingUp.map((report) => `${report.title.split(' ')[0]} (+${report.delta})`).join(', ')
      : 'no reports trending up'

  return (
    <div className="pb-2">
      <PageHeader
        title="🚨 Tamper & anomaly reports"
        subtitle={
          <>
            Automated rule-based queries — each report targets a specific theft pattern or grid anomaly ·{' '}
            {isStateLevel ? 'showing state-wide totals' : `filtered to ${scopeName}`}
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
                  title: 'Daily digest scheduled',
                  message: 'Reports auto-emailed to your address every morning at 8 AM. Configure in Settings.',
                  duration: 4000,
                })
              }
            >
              📅 Schedule digest
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'AI batch run triggered',
                  message: 'Re-running all 8 queries on overnight MRI data. Results in about 12 minutes.',
                  duration: 4500,
                })
              }
            >
              ✦ Run all reports
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="flex items-center gap-2">
            <span className="text-[10.5px] font-semibold text-text-mid">
              {formatIndian(totalAffected)} flagged · {fmtINR(totalImpact)} exposure
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '10px', padding: '3px 9px', color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
              onClick={toggleScopePicker}
            >
              ↕ Change scope
            </button>
          </span>
        }
      />

      <ScopePill />

      <AiInsightBanner title={`Today's tamper & anomaly summary — ${currentRole.label} · ${scopeName}`}>
        {totalAffected > 0 ? (
          <>
            <strong>{formatIndian(totalAffected)} meters flagged</strong> across <strong>{reports.length} reports</strong> at{' '}
            <strong>{scopeName}</strong>. Combined revenue exposure:{' '}
            <strong style={{ color: 'var(--red)' }}>{fmtINR(totalImpact)}</strong> if all confirmed.
          </>
        ) : (
          <>
            <strong style={{ color: 'var(--green)' }}>No flags at {scopeName}</strong> across the {reports.length} active reports — clean slate this run.
          </>
        )}
        {trendingUp.length > 0 ? (
          <>
            <br />
            <br />
            <strong style={{ color: 'var(--red)' }}>
              {trendingUp.length} report{trendingUp.length > 1 ? 's' : ''} trending up
            </strong>{' '}
            — {trendingText}.
          </>
        ) : null}
        <br />
        <br />
        Click any report card to see the affected meter list and drill into individual cases{!isStateLevel ? ` within ${scopeName}` : ''}.
      </AiInsightBanner>

      <div className="kpi-row">
        <div
          className="kpi-card clickable"
          onClick={() => {
            critSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            showToast({
              type: 'info',
              title: 'Critical reports highlighted',
              message: 'Showing the critical-severity reports. Click any card to drill in.',
              duration: 3500,
            })
          }}
        >
          <div className="kpi-accent" style={{ background: 'var(--red)' }} />
          <div className="kpi-label">Critical reports</div>
          <div className="kpi-value" style={{ color: 'var(--red)' }}>{criticalCount}</div>
          <div className="kpi-sub">High-priority tamper</div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() => critSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
          <div className="kpi-label">High priority</div>
          <div className="kpi-value">{highPriority.length}</div>
          <div className="kpi-sub">Daily review</div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() => medSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
          <div className="kpi-label">Medium priority</div>
          <div className="kpi-value">{mediumPriority.length}</div>
          <div className="kpi-sub">Weekly review</div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'info',
              title: `Total flagged at ${scopeName}`,
              message: `${formatIndian(totalAffected)} unique meters across all 8 queries at ${scopeName}. Some meters appear in multiple reports (cross-flagged). Click any report card to see its specific list.`,
              duration: 5000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
          <div className="kpi-label">Total flagged · {scopeName}</div>
          <div className="kpi-value">{formatIndian(totalAffected)}</div>
          <div className="kpi-sub">Across all reports</div>
        </div>

        <div
          className="kpi-card clickable"
          onClick={() =>
            showToast({
              type: 'warning',
              title: 'Revenue exposure breakdown',
              message: `${fmtINR(totalImpact)} if all flagged cases at ${scopeName} confirm as theft. Click report cards for per-case estimates.`,
              duration: 6000,
            })
          }
        >
          <div className="kpi-accent" style={{ background: 'var(--red)' }} />
          <div className="kpi-label">Revenue exposure</div>
          <div className="kpi-value" style={{ color: 'var(--red)', fontSize: '18px' }}>{fmtINR(totalImpact)}</div>
          <div className="kpi-sub">If all confirmed</div>
        </div>
      </div>

      <div
        ref={critSectionRef}
        className="mt-[18px] mb-2.5 border-b border-border pb-1.5 text-[11.5px] font-extrabold uppercase tracking-[1px]"
        style={{ color: 'var(--red)' }}
      >
        <span style={{ color: 'var(--red)', fontSize: '14px' }}>■ </span>
        Critical Tamper Reports — daily review (high priority)
      </div>
      <div
        className="mb-4 grid gap-3.5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))' }}
      >
        {highPriority.map((report) => (
          <DiagnosticReportCard key={report.id} report={report} onOpen={() => setSelectedReportId(report.id)} />
        ))}
      </div>

      <div
        ref={medSectionRef}
        className="mt-[18px] mb-2.5 border-b border-border pb-1.5 text-[11.5px] font-extrabold uppercase tracking-[1px]"
        style={{ color: 'var(--amber-dark, #9c5a14)' }}
      >
        <span style={{ color: 'var(--amber)', fontSize: '14px' }}>■ </span>
        Anomaly Reports — weekly review (medium priority)
      </div>
      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))' }}
      >
        {mediumPriority.map((report) => (
          <DiagnosticReportCard key={report.id} report={report} onOpen={() => setSelectedReportId(report.id)} />
        ))}
      </div>

      {selectedReport ? (
        <DiagnosticDetailPanel
          report={selectedReport}
          scopeId={scopeId}
          scopeName={scopeName}
          isStateLevel={isStateLevel}
          onClose={() => setSelectedReportId(null)}
        />
      ) : null}
    </div>
  )
}
