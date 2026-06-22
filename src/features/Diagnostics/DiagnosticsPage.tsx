import { useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { enrichLevel } from '@/features/Dashboard/adapter'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import { DIAGNOSTIC_REPORTS, scopeDiagnosticCount, type DiagnosticReport } from '@/features/Diagnostics/data/diagnostics'
import { useToast } from '@/shared/context/ToastContext'
import { DiagnosticDetailModal } from './DiagnosticDetailModal'

export default function DiagnosticsPage() {
  const { currentNode, hierPath } = useScope()
  const { showToast } = useToast()
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(null)

  const level = currentNode ? enrichLevel(currentNode) : null
  const scopeName = level?.name ?? 'UPPCL'
  const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
  const isStateLevel = !level || level.type === 'State'

  // Scope-adjust counts
  const scopedReports = DIAGNOSTIC_REPORTS.map((r) => ({
    ...r,
    count: scopeDiagnosticCount(r.count, scopeId),
    revenue_impact: Math.round(r.revenue_impact * (scopeDiagnosticCount(r.count, scopeId) / Math.max(r.count, 1))),
  }))

  const highPriority = scopedReports.filter((r) => r.priority === 'high')
  const mediumPriority = scopedReports.filter((r) => r.priority === 'medium')
  const criticalCount = highPriority.filter((r) => r.severity === 'critical').length
  const totalAffected = scopedReports.reduce((s, r) => s + r.count, 0)
  const totalImpact = scopedReports.reduce((s, r) => s + r.revenue_impact, 0)

  const trendingUp = scopedReports.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 3)

  return (
    <div className="pb-8">
      <PageHeader
        title="🚨 Tamper & anomaly reports"
        subtitle={`Automated rule-based queries · each targets a specific theft pattern · ${isStateLevel ? 'state-wide totals' : `filtered to ${scopeName}`}`}
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Daily digest scheduled', message: 'Reports auto-emailed at 8 AM. Configure in Settings.', duration: 4000 })}
            >
              📅 Schedule digest
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'success', title: 'AI batch run triggered', message: 'Re-running all queries on overnight MRI data. Results in ~12 minutes.', duration: 4500 })}
            >
              ✦ Run all reports
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="text-[10.5px] font-semibold text-text-mid">
            {formatIndian(totalAffected)} flagged · {fmtINR(totalImpact)} exposure
          </span>
        }
      />

      {/* AI Insight */}
      <AiInsightBanner title={`Today's tamper & anomaly summary — ${scopeName}`}>
        {totalAffected > 0 ? (
          <>
            <strong>{formatIndian(totalAffected)} meters flagged</strong> across{' '}
            <strong>{scopedReports.length} reports</strong> at <strong>{scopeName}</strong>. Combined revenue
            exposure:{' '}
            <strong style={{ color: 'var(--red)' }}>{fmtINR(totalImpact)}</strong> if all confirmed.
          </>
        ) : (
          <strong style={{ color: 'var(--green)' }}>No flags at {scopeName}</strong>
        )}
        {trendingUp.length > 0 && (
          <>
            <br /><br />
            <strong style={{ color: 'var(--red)' }}>
              {trendingUp.length} report{trendingUp.length > 1 ? 's' : ''} trending up
            </strong>{' '}
            — {trendingUp.map((r) => `${r.title.split(' ')[0]} (+${r.delta})`).join(', ')}.
          </>
        )}
        <br /><br />
        Click any report card to see the affected meter list and drill into individual cases
        {!isStateLevel && ` within ${scopeName}`}.
      </AiInsightBanner>

      {/* KPI Row */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Critical reports', value: String(criticalCount), sub: 'High-priority tamper', accent: 'var(--red)', valueColor: 'var(--red)' },
          { label: 'High priority', value: String(highPriority.length), sub: 'Daily review', accent: 'var(--amber)', valueColor: 'var(--text)' },
          { label: 'Medium priority', value: String(mediumPriority.length), sub: 'Weekly review', accent: 'var(--teal, #00c2cb)', valueColor: 'var(--text)' },
          { label: `Total flagged · ${scopeName}`, value: formatIndian(totalAffected), sub: 'Across all reports', accent: 'var(--ai-purple)', valueColor: 'var(--text)' },
          { label: 'Revenue exposure', value: fmtINR(totalImpact), sub: 'If all confirmed', accent: 'var(--red)', valueColor: 'var(--red)', fontSize: '18px' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="kpi-card relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: kpi.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{kpi.label}</div>
            <div className="font-mono font-extrabold" style={{ color: kpi.valueColor, fontSize: kpi.fontSize ?? '24px' }}>{kpi.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* High Priority Reports */}
      <div
        className="mb-1.5 px-1 text-[10.5px] font-bold uppercase tracking-[0.8px]"
        style={{ color: 'var(--red)' }}
      >
        Critical Tamper Reports — daily review (high priority)
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {highPriority.map((r) => (
          <DiagnosticCard key={r.id} report={r} onClick={() => setSelectedReport(r)} />
        ))}
      </div>

      {/* Medium Priority Reports */}
      <div
        className="mb-1.5 px-1 text-[10.5px] font-bold uppercase tracking-[0.8px]"
        style={{ color: 'var(--teal, #00c2cb)' }}
      >
        Anomaly Reports — weekly review (medium priority)
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mediumPriority.map((r) => (
          <DiagnosticCard key={r.id} report={r} onClick={() => setSelectedReport(r)} />
        ))}
      </div>

      {selectedReport && (
        <DiagnosticDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  )
}

// ─── Diagnostic Card ─────────────────────────────────────────────────────────
function DiagnosticCard({ report: r, onClick }: { report: DiagnosticReport; onClick: () => void }) {
  const sevColor =
    r.severity === 'critical' ? 'var(--red)' : r.severity === 'high' ? 'var(--amber)' : '#00c2cb'
  const sevBg =
    r.severity === 'critical' ? 'rgba(220,53,69,.1)' : r.severity === 'high' ? 'rgba(230,146,30,.1)' : 'rgba(23,162,184,.1)'

  const trendColor = r.delta > 0 ? 'var(--red)' : r.delta < 0 ? 'var(--green)' : 'var(--text-dim)'
  const trendIcon = r.delta > 0 ? '↑' : r.delta < 0 ? '↓' : '→'
  const trendText = r.delta === 0 ? 'no change' : `${trendIcon} ${Math.abs(r.delta)} vs last week`
  const impactStr = r.revenue_impact > 0 ? `₹${(r.revenue_impact / 100000).toFixed(1)}L est.` : 'Network-level'

  return (
    <button
      type="button"
      onClick={onClick}
      className="card group flex cursor-pointer flex-col gap-0 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderTop: `3px solid ${sevColor}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-[14px_16px_10px]">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[18px]">{r.icon}</span>
            <span
              className="rounded-lg px-1.5 py-px text-[9px] font-extrabold uppercase tracking-[0.3px]"
              style={{ background: sevBg, color: sevColor }}
            >
              {r.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-[13px] font-bold text-text">{r.title}</div>
          <div className="mt-0.5 text-[11px] text-text-dim">{r.sub}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-[26px] font-extrabold leading-none" style={{ color: sevColor }}>
            {r.count}
          </div>
          <div className="text-[10px] font-medium text-text-dim">flagged</div>
        </div>
      </div>

      {/* Mini bar viz */}
      <div className="mx-4 mb-3 flex h-1 overflow-hidden rounded-full bg-border">
        <div
          className="rounded-full transition-all"
          style={{ width: `${Math.min(100, (r.count / 400) * 100)}%`, background: sevColor }}
        />
      </div>

      {/* Insight */}
      <div
        className="mx-4 mb-3 rounded-lg px-3 py-2 text-[11px] leading-[1.5] text-text-mid"
        style={{ background: sevBg }}
        dangerouslySetInnerHTML={{ __html: `✦ ${r.insight}` }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-[10.5px] font-semibold" style={{ color: trendColor }}>
            {trendText}
          </span>
          <span className="text-[10px] font-semibold text-text-dim">{impactStr}</span>
        </div>
        <span
          className="text-[10.5px] font-bold transition-colors group-hover:underline"
          style={{ color: sevColor }}
        >
          View list →
        </span>
      </div>
    </button>
  )
}
