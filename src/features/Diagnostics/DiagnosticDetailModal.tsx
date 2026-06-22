import { useEffect } from 'react'
import type { DiagnosticReport } from '@/features/Diagnostics/data/diagnostics'
import { useToast } from '@/shared/context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { getPathForScreen } from '@/shared/utils/navigation'

interface DiagnosticDetailModalProps {
  report: DiagnosticReport
  onClose: () => void
}

const SAMPLE_METERS: Record<string, Array<{ id: string; area: string; drop?: number; events?: number }>> = {
  'phase-missing': [
    { id: '1849966', area: 'Bhelupur · DT-0445', drop: -54, events: 8 },
    { id: '2034871', area: 'Gomti Nagar · DT-0887', drop: -44, events: 5 },
    { id: '1567234', area: 'Alambagh · DT-0234', drop: -38, events: 3 },
  ],
  'cover-open': [
    { id: '1923445', area: 'Indira Nagar · DT-1098', events: 12 },
    { id: '1456789', area: 'Rajajipuram · DT-0889', events: 3 },
    { id: '2098765', area: 'Mahanagar · DT-1234', events: 5 },
  ],
  default: [
    { id: '2187690', area: 'Aliganj · DT-0556', drop: -61, events: 8 },
    { id: '1678432', area: 'Hazratganj · DT-0112', drop: -33, events: 5 },
    { id: '1789034', area: 'Chinhat · DT-0678', drop: -18, events: 4 },
  ],
}

export function DiagnosticDetailModal({ report: r, onClose }: DiagnosticDetailModalProps) {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const meters = SAMPLE_METERS[r.id] ?? SAMPLE_METERS.default
  const sevColor = r.severity === 'critical' ? 'var(--red)' : r.severity === 'high' ? 'var(--amber)' : '#00c2cb'

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[600px] max-w-[95vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-start justify-between rounded-t-2xl p-4"
          style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{r.icon}</span>
            <div>
              <div className="font-bold text-white text-[15px]">{r.title}</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{r.sub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg px-2.5 py-1 text-[10px] font-extrabold uppercase"
              style={{ background: `${sevColor}25`, color: sevColor, border: `1px solid ${sevColor}40` }}>
              {r.severity}
            </span>
            <button type="button" onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Stats row */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Flagged meters', value: String(r.count), color: sevColor },
              { label: 'Weekly trend', value: r.delta === 0 ? '→ flat' : r.delta > 0 ? `↑ +${r.delta}` : `↓ ${r.delta}`, color: r.delta > 0 ? 'var(--red)' : r.delta < 0 ? 'var(--green)' : 'var(--text-dim)' },
              { label: 'Est. revenue impact', value: r.revenue_impact > 0 ? `₹${(r.revenue_impact / 100000).toFixed(1)}L` : 'Network', color: r.revenue_impact > 0 ? 'var(--red)' : 'var(--text-mid)' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-bg p-3 text-center">
                <div className="font-mono text-[18px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-text-dim">{s.label}</div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="mb-4 rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="mb-1.5 text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>✦ AI insight</div>
            <p className="text-[11.5px] leading-[1.55] text-text-mid" dangerouslySetInnerHTML={{ __html: r.insight }} />
          </div>

          {/* Physics */}
          <div className="mb-4 rounded-xl border border-border bg-bg p-3">
            <div className="mb-1.5 text-[11px] font-bold text-text">⚡ Detection physics</div>
            <p className="text-[11.5px] leading-[1.5] text-text-mid">{r.physics}</p>
            <div className="mt-2 text-[10.5px] text-text-dim">Typical meters: <span className="font-medium text-text-mid">{r.typical_meters}</span></div>
          </div>

          {/* Sample affected meters */}
          <div className="mb-4">
            <div className="mb-2 text-[12px] font-bold text-text">Sample affected meters (showing {meters.length} of {r.count})</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr className="table-header">
                    <th>Meter ID</th>
                    <th>Area / DT</th>
                    {r.id !== 'cover-open' && <th>Consumption drop</th>}
                    <th>Events</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {meters.map((m) => (
                    <tr key={m.id} className="table-row">
                      <td className="font-mono font-bold" style={{ color: 'var(--id-text)' }}>#{m.id}</td>
                      <td className="text-[11px] text-text-mid">{m.area}</td>
                      {r.id !== 'cover-open' && (
                        <td className="font-mono font-bold" style={{ color: m.drop && m.drop < -40 ? 'var(--red)' : 'var(--amber)' }}>
                          {m.drop != null ? `${m.drop}%` : '—'}
                        </td>
                      )}
                      <td className="font-mono">{m.events}</td>
                      <td>
                        <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 7px' }}
                          onClick={() => { navigate(getPathForScreen('meters')); onClose() }}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
              onClick={() => { showToast({ type: 'success', title: 'Batch case creation started', message: `Creating cases for all ${r.count} flagged meters in this report.`, duration: 4000 }); onClose() }}>
              ✦ Create {r.count} cases
            </button>
            <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px' }}
              onClick={() => showToast({ type: 'info', title: 'Export ready', message: 'Full meter list exported as CSV.', duration: 3000 })}>
              📁 Export CSV
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
