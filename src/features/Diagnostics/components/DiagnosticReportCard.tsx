import type { DiagnosticReport } from '../types'
import { DiagnosticMiniViz } from './DiagnosticMiniViz'

interface DiagnosticReportCardProps {
  report: DiagnosticReport
  onOpen: () => void
}

function severityColors(severity: DiagnosticReport['severity']) {
  if (severity === 'critical') {
    return {
      accent: 'var(--red)',
      badgeBg: 'rgba(255,77,77,0.12)',
      badgeText: 'var(--red)',
      count: 'var(--red)',
    }
  }

  if (severity === 'high') {
    return {
      accent: 'var(--amber)',
      badgeBg: 'rgba(246,162,44,0.12)',
      badgeText: 'var(--amber)',
      count: 'var(--amber)',
    }
  }

  return {
    accent: 'var(--teal, #00c2cb)',
    badgeBg: 'rgba(14,165,233,0.1)',
    badgeText: 'var(--teal, #00c2cb)',
    count: 'var(--teal, #00c2cb)',
  }
}

export function DiagnosticReportCard({ report, onOpen }: DiagnosticReportCardProps) {
  const colors = severityColors(report.severity)
  const trendIcon = report.delta > 0 ? '↑' : report.delta < 0 ? '↓' : '→'
  const trendText = report.delta === 0 ? 'no change' : `${trendIcon} ${Math.abs(report.delta)} vs last week`
  const impactText =
    report.revenueImpact > 0 ? `₹${(report.revenueImpact / 100000).toFixed(1)}L est.` : 'Network-level (no consumer impact)'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTop: `3px solid ${colors.accent}` }}
    >
      <div className="flex items-start justify-between gap-3 p-[14px_16px_10px]">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[18px]">{report.icon}</span>
            <span
              className="rounded-md px-2 py-px text-[9px] font-extrabold uppercase tracking-[0.35px]"
              style={{ background: colors.badgeBg, color: colors.badgeText }}
            >
              {report.severity.toUpperCase()}
            </span>
          </div>
          <div className="text-[13px] font-bold text-text">{report.title}</div>
          <div className="mt-0.5 text-[11px] text-text-dim">{report.sub}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-[26px] font-extrabold leading-none" style={{ color: colors.count }}>
            {report.count}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.7px] text-text-dim">flagged</div>
        </div>
      </div>

      <div className="mx-4 mb-3 flex h-[50px] items-center overflow-hidden rounded-xl bg-[#f4f7fb] px-3">
        <DiagnosticMiniViz report={report} />
      </div>

      <div
        className="mx-4 mb-3 rounded-xl px-3 py-2 text-[11px] leading-[1.55] text-text-mid"
        style={{ background: colors.badgeBg }}
        dangerouslySetInnerHTML={{ __html: `✦ ${report.insight}` }}
      />

      <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-[10.5px] font-semibold" style={{ color: report.delta > 0 ? 'var(--red)' : report.delta < 0 ? 'var(--green)' : 'var(--text-dim)' }}>
            {trendText}
          </span>
          <span className="text-[10px] font-semibold text-text-dim">{impactText}</span>
        </div>
        <span className="text-[10.5px] font-bold" style={{ color: colors.accent }}>
          View list →
        </span>
      </div>
    </button>
  )
}
