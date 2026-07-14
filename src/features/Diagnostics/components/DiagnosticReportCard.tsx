import type { DiagnosticReport } from '../types'
import { DiagnosticMiniViz } from './DiagnosticMiniViz'

interface DiagnosticReportCardProps {
  report: DiagnosticReport
  onOpen: () => void
}

function severityColors(severity: DiagnosticReport['severity']) {
  if (severity === 'critical') {
    return { accent: 'var(--red)', badgeBg: 'rgba(220,53,69,0.12)', badgeText: 'var(--red)', count: 'var(--red)' }
  }
  if (severity === 'high') {
    return { accent: 'var(--amber)', badgeBg: 'rgba(230,146,30,0.12)', badgeText: 'var(--amber)', count: 'var(--amber)' }
  }
  return {
    accent: 'var(--teal, #17a2b8)',
    badgeBg: 'rgba(23,162,184,0.12)',
    badgeText: 'var(--teal, #17a2b8)',
    count: 'var(--teal, #17a2b8)',
  }
}

/** Port of the prototype's renderDiagnosticReportCard() (.diag-card). */
export function DiagnosticReportCard({ report, onOpen }: DiagnosticReportCardProps) {
  const colors = severityColors(report.severity)
  const trendCls = report.delta > 0 ? 'up' : report.delta < 0 ? 'down' : 'flat'
  const trendIcon = report.delta > 0 ? '↑' : report.delta < 0 ? '↓' : '→'
  const trendText = report.delta === 0 ? 'no change' : `${trendIcon} ${Math.abs(report.delta)} vs last week`
  const trendStyle =
    trendCls === 'up'
      ? { background: 'rgba(220,53,69,0.1)', color: 'var(--red)' }
      : trendCls === 'down'
        ? { background: 'rgba(40,167,69,0.1)', color: 'var(--green)' }
        : { background: 'var(--bg)', color: 'var(--text-dim)' }
  const impactText =
    report.revenueImpact > 0
      ? `₹${(report.revenueImpact / 100000).toFixed(1)}L est.`
      : 'Network-level (no consumer impact)'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`diag-card sev-${report.severity} group flex h-full cursor-pointer flex-col overflow-hidden rounded-[10px] border border-border bg-card text-left`}
      style={{ padding: '14px 16px' }}
    >
      {/* header */}
      <div className="mb-2.5 flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-[18px]">{report.icon}</span>
            <span
              className="rounded-lg px-[7px] py-0.5 text-[9px] font-extrabold uppercase tracking-[0.3px]"
              style={{ background: colors.badgeBg, color: colors.badgeText }}
            >
              {report.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-[13px] font-bold leading-[1.35] text-text">{report.title}</div>
          <div className="text-[10.5px] font-medium text-text-dim">{report.sub}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[24px] font-extrabold leading-none" style={{ color: colors.count }}>
            {report.count}
          </div>
          <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.4px] text-text-dim">flagged</div>
        </div>
      </div>

      {/* mini-viz */}
      <div
        className="my-2 flex h-[60px] items-center justify-center overflow-hidden rounded-md p-1.5"
        style={{ background: 'linear-gradient(180deg, var(--bg) 0%, rgba(255,255,255,0.5) 100%)' }}
      >
        <DiagnosticMiniViz report={report} />
      </div>

      {/* insight */}
      <div
        className="mt-2 rounded-md px-2.5 py-[7px] text-[10.5px] leading-[1.5] text-text-mid"
        style={{ background: 'var(--ai-purple-light)' }}
        dangerouslySetInnerHTML={{ __html: `✦ ${report.insight}` }}
      />

      {/* foot */}
      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-2" style={{ marginTop: '10px' }}>
        <div className="flex items-center gap-2">
          <span className="rounded-lg px-[7px] py-0.5 text-[10px] font-bold" style={trendStyle}>
            {trendText}
          </span>
          <span className="text-[10px] font-semibold text-text-dim">{impactText}</span>
        </div>
        <span className="text-[10.5px] font-bold" style={{ color: 'var(--ai-purple)' }}>
          View list →
        </span>
      </div>
    </button>
  )
}
