import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPathForScreen } from '@/shared/utils/navigation'
import { useToast } from '@/shared/context/ToastContext'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import { getDiagnosticAffectedMeters, getDiagnosticEvidenceLabel } from '../data/diagnostics'
import type { DiagnosticReport } from '../types'

interface DiagnosticDetailPanelProps {
  report: DiagnosticReport
  scopeId: string
  scopeName: string
  isStateLevel: boolean
  onClose: () => void
}

export function DiagnosticDetailPanel({
  report,
  scopeId,
  scopeName,
  isStateLevel,
  onClose,
}: DiagnosticDetailPanelProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const sevColor =
    report.severity === 'critical' ? 'var(--red)' : report.severity === 'high' ? 'var(--amber)' : 'var(--teal, #00c2cb)'

  const visibleCount = Math.max(1, Math.min(report.count, 18))
  const meters = getDiagnosticAffectedMeters(report.id, visibleCount, scopeId)
  const evidenceLabel = getDiagnosticEvidenceLabel(report.id)
  const totalShownImpact = meters.reduce((sum, meter) => sum + meter.estimatedLoss, 0)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="assign-panel fixed right-0 top-0 z-50 flex h-full flex-col overflow-hidden bg-bg shadow-[-12px_0_40px_rgba(0,0,0,0.18)]"
        style={{ width: 'min(900px, 100vw)', borderLeft: '1px solid var(--border)' }}
      >
        <div
          className="flex flex-shrink-0 items-start justify-between border-b px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
            borderBottomColor: 'rgba(255,255,255,0.08)',
            borderBottomWidth: '1px',
          }}
        >
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[14px] text-[24px] text-white"
              style={{ background: sevColor }}
            >
              {report.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-white">{report.title}</div>
              <div className="mt-0.5 text-[11px] text-[rgba(255,255,255,0.58)]">
                {report.sub} · {formatIndian(visibleCount)} of {formatIndian(report.count)} affected consumers shown at{' '}
                <strong style={{ color: 'var(--ai-purple)' }}>{scopeName}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.55)] transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden px-5 py-4">
          <AiInsightBanner title="How this report works (physics)" live={false} className="mb-3 flex-shrink-0">
            <span dangerouslySetInnerHTML={{ __html: report.physics }} />
          </AiInsightBanner>

          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              type="button"
              className="kpi-card relative overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left"
              onClick={() =>
                showToast({
                  type: 'warning',
                  title: `${report.title} - affected consumers`,
                  message: `${formatIndian(report.count)} consumers flagged at ${scopeName}${isStateLevel ? '' : ` (scope filtered)`}. Showing ${formatIndian(visibleCount)} in this panel.`,
                  duration: 5000,
                })
              }
            >
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: sevColor }} />
              <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">Affected consumers</div>
              <div className="font-mono text-[24px] font-extrabold" style={{ color: sevColor }}>
                {formatIndian(report.count)}
              </div>
              <div className="mt-0.5 text-[10px] text-text-mid">{isStateLevel ? 'total in this report' : `at ${scopeName}`}</div>
            </button>

            <button
              type="button"
              className="kpi-card relative overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Typical consumer profile',
                  message: `${report.title} typically affects: ${report.typicalMeters}. Use this to anticipate which consumer segments to focus enforcement on.`,
                  duration: 5000,
                })
              }
            >
              <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: 'var(--ai-purple)' }} />
              <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">Typical profile</div>
              <div className="text-[11px] font-semibold leading-[1.35] text-text">{report.typicalMeters}</div>
            </button>

            {report.revenueImpact > 0 ? (
              <button
                type="button"
                className="kpi-card relative overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left"
                onClick={() =>
                  showToast({
                    type: 'warning',
                    title: 'Revenue exposure',
                    message: `${fmtINR(report.revenueImpact)} estimated annual exposure at ${scopeName} if all flagged cases confirm as theft. Average per case: ${fmtINR(Math.round(report.revenueImpact / Math.max(1, report.count)))}.`,
                    duration: 6500,
                  })
                }
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: 'var(--red)' }} />
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">Revenue exposure</div>
                <div className="font-mono text-[18px] font-extrabold" style={{ color: 'var(--red)' }}>
                  {fmtINR(report.revenueImpact)}
                </div>
                <div className="mt-0.5 text-[10px] text-text-mid">if all confirmed</div>
              </button>
            ) : (
              <div className="kpi-card relative overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: 'var(--text-dim)' }} />
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">Revenue exposure</div>
                <div className="text-[11px] font-semibold text-text-mid">Network-level report</div>
              </div>
            )}
          </div>

          <div className="mb-2 text-[12px] font-bold text-text">
            Affected consumers{isStateLevel ? '' : ` · ${scopeName}`}
          </div>

          <div className="table-wrap flex-1 min-h-0 overflow-hidden">
            <table>
              <thead>
                <tr className="table-header">
                  <th>Meter #</th>
                  <th>Consumer</th>
                  <th>Location</th>
                  <th>{evidenceLabel}</th>
                  <th>Detected</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {meters.map((meter) => (
                  <tr
                    key={meter.id}
                    className="table-row"
                    style={{ cursor: report.id === 'ht-imbalance' ? 'default' : 'pointer' }}
                    onClick={() => {
                      if (report.id === 'ht-imbalance') {
                        return
                      }
                      navigate(getPathForScreen('meterDetail', meter.id))
                      onClose()
                    }}
                  >
                    <td className="font-mono text-[10.5px] font-bold">
                      {meter.id}
                      {meter.real ? (
                        <span
                          className="ml-1 inline-block rounded-md border px-1.5 py-px align-middle text-[8px] font-extrabold"
                          style={{ background: 'rgba(40,167,69,0.12)', color: 'var(--green)', borderColor: 'rgba(40,167,69,0.3)' }}
                        >
                          REAL
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <div className="max-w-[190px] truncate text-[11px] font-semibold text-text">{meter.consumer}</div>
                      <div className="text-[9.5px] text-text-dim">
                        {meter.activity} · {meter.tariff}
                      </div>
                    </td>
                    <td className="text-[10.5px] text-text-mid">
                      <div>{meter.location.split(' · ').slice(0, 2).join(' · ')}</div>
                      <div className="text-[9.5px] text-text-dim">{meter.location.split(' · ').slice(2).join(' · ')}</div>
                    </td>
                    <td className="font-mono text-[10px] font-semibold text-red-500">{meter.evidence}</td>
                    <td className="text-[10.5px] text-text-dim">{meter.detected}</td>
                    <td className="text-right text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>
                      {report.id === 'ht-imbalance' ? 'network' : '›'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalShownImpact > 0 ? (
            <div className="mt-2 flex-shrink-0 rounded-lg bg-bg px-3 py-2 text-right text-[11px] text-text-mid">
              <strong>Estimated revenue at risk on shown consumers: {fmtINR(totalShownImpact)}</strong>
            </div>
          ) : null}

          <div className="mt-3 flex flex-shrink-0 gap-2">
            <button
              type="button"
              className="btn btn-ai flex-1"
              style={{ justifyContent: 'center', fontSize: '12px' }}
              onClick={() => {
                showToast({
                  type: 'success',
                  title: 'Cases auto-created',
                  message: `AI created ${formatIndian(meters.length)} new cases from this report${isStateLevel ? '' : ` at ${scopeName}`} and assigned to nearest inspectors. Tracking in Cases screen.`,
                  duration: 5000,
                })
                onClose()
              }}
            >
              ✦ Auto-create {formatIndian(meters.length)} cases
            </button>
            <button
              type="button"
              className="btn btn-outline flex-1"
              style={{ justifyContent: 'center', fontSize: '12px' }}
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'CSV export started',
                  message: `Exporting ${formatIndian(report.count)} affected consumers${isStateLevel ? '' : ` from ${scopeName}`} with all evidence fields.`,
                  duration: 3500,
                })
              }
            >
              📥 Export full list ({formatIndian(report.count)}) as CSV
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
