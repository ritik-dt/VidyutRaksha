import { useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/features/Dashboard/adapter'
import { DiagnosticDetailPanel } from './components/DiagnosticDetailPanel'
import { DiagnosticReportCard } from './components/DiagnosticReportCard'
import { DiagnosticScopePill } from './components/DiagnosticScopePill'
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

      <div className="mb-3">
        <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.8px] text-text-dim">
          Scope summary
        </div>
        <DiagnosticScopePill scopeName={scopeName} totalAffected={totalAffected} totalImpact={totalImpact} />
      </div>

      <AiInsightBanner title={`Today's tamper & anomaly summary — ${currentRole.label} · ${scopeName}`}>
        <strong>{formatIndian(totalAffected)} meters flagged</strong> across <strong>{reports.length} reports</strong> at{' '}
        <strong>{scopeName}</strong>. Combined revenue exposure: <strong style={{ color: 'var(--red)' }}>{fmtINR(totalImpact)}</strong>{' '}
        if all confirmed.
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

      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          {
            label: 'Critical reports',
            value: String(criticalCount),
            sub: 'High-priority tamper',
            accent: 'var(--red)',
            valueColor: 'var(--red)',
          },
          {
            label: 'High priority',
            value: String(highPriority.length),
            sub: 'Daily review',
            accent: 'var(--amber)',
            valueColor: 'var(--text)',
          },
          {
            label: 'Medium priority',
            value: String(mediumPriority.length),
            sub: 'Weekly review',
            accent: 'var(--teal, #00c2cb)',
            valueColor: 'var(--text)',
          },
          {
            label: `Total flagged · ${scopeName}`,
            value: formatIndian(totalAffected),
            sub: 'Across all reports',
            accent: 'var(--ai-purple)',
            valueColor: 'var(--text)',
          },
          {
            label: 'Revenue exposure',
            value: fmtINR(totalImpact),
            sub: 'If all confirmed',
            accent: 'var(--red)',
            valueColor: 'var(--red)',
            fontSize: '18px',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="kpi-card relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: kpi.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{kpi.label}</div>
            <div className="font-mono font-extrabold" style={{ color: kpi.valueColor, fontSize: kpi.fontSize ?? '24px' }}>
              {kpi.value}
            </div>
            <div className="mt-0.5 text-[10px] text-text-mid">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-1.5 px-1 text-[10.5px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--red)' }}>
        Critical Tamper Reports — daily review (high priority)
      </div>
      <div className="mb-5 grid gap-3 lg:grid-cols-2">
        {highPriority.map((report) => (
          <DiagnosticReportCard key={report.id} report={report} onOpen={() => setSelectedReportId(report.id)} />
        ))}
      </div>

      <div className="mb-1.5 px-1 text-[10.5px] font-bold uppercase tracking-[0.8px]" style={{ color: 'var(--amber)' }}>
        Anomaly Reports — weekly review (medium priority)
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
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
