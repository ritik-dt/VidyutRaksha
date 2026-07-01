import { useEffect } from 'react'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import type { CaseRecord } from '@/features/Cases/data/cases'

interface CaseDetailPanelProps {
  caseRecord: CaseRecord
  onClose: () => void
  onAssign: (id: string) => void
}

const LIFECYCLE_STEPS = (cs: CaseRecord) => [
  { label: 'AI flagged meter', date: cs.created, done: true },
  { label: 'Case auto-created', date: cs.created, done: true },
  { label: `Assigned to ${cs.assignee}`, date: cs.created, done: cs.assignee !== 'Unassigned' },
  {
    label: 'Field inspection',
    date: ['Confirmed Theft', 'False Positive'].includes(cs.status) ? cs.due : 'Pending',
    done: ['Confirmed Theft', 'False Positive'].includes(cs.status),
  },
  {
    label: 'Outcome → model retrain',
    date: cs.status === 'Confirmed Theft' ? 'Feeds AI learning' : '—',
    done: cs.status === 'Confirmed Theft',
  },
]

export function CaseDetailPanel({ caseRecord: cs, onClose, onAssign }: CaseDetailPanelProps) {
  const steps = LIFECYCLE_STEPS(cs)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="assign-panel fixed right-0 top-0 z-50 flex h-full w-[520px] max-w-full flex-col overflow-y-auto border-l border-border bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.12)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,var(--navy)_0%,var(--navy-light)_100%)] p-4 pb-3">
          <div>
            <div className="font-mono text-[15px] font-bold text-white">{cs.id}</div>
            <div className="text-[11px] text-[rgba(255,255,255,0.55)]">
              Meter #{cs.meter} · {cs.area}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={cs.status} />
            <button
              type="button"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4">
          {/* Real case badge */}
          {cs._real && (
            <div
              className="mb-3 flex items-start gap-3 rounded-xl border-2 border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.06)] p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green text-[18px] text-white">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[rgba(34,197,94,0.8)] px-2 py-px text-[9.5px] font-extrabold tracking-wider text-white uppercase">
                    REAL CASE
                  </span>
                  <span className="text-[11.5px] font-bold text-text">From Mar-2026 KVVNL tamper event report</span>
                </div>
                <div className="mt-1 text-[11px] leading-[1.5] text-text-mid">
                  <strong>Account #{cs._account}</strong> · {cs.consumer}
                  {cs._activity && ` · ${cs._activity}`}
                  {cs._load && ` · ${cs._load}${cs._load_unit ?? ''} sanctioned`}
                  {cs._tariff && ` · Tariff ${cs._tariff}`}
                  {cs._zone && ` · ${cs._zone} zone`}
                </div>
              </div>
            </div>
          )}

          {/* AI briefing */}
          <div className="mb-3 rounded-xl border border-[rgba(124,58,237,0.15)] bg-[rgba(124,58,237,0.06)] px-3.5 py-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-ai-purple">
              ✦ AI case briefing
            </div>
            <p className="text-[11.5px] leading-[1.55] text-text-mid">
              This case involves a <strong>{cs.risk}-risk meter</strong> with{' '}
              <strong>{cs.flags} flag triggers</strong>. Based on similar cases in your network, I predict a{' '}
              <strong>68% probability of confirmed theft</strong>. If confirmed, the inspection outcome will
              automatically retrain the model for better future detection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Details card */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11.5px] font-bold text-text">Details</div>
                {(cs.status === 'Assigned' || cs.status === 'In Progress' || cs.status === 'New') && (
                  <button
                    type="button"
                    className="btn btn-ai px-2.5 py-1 text-[10px]"
                    onClick={() => onAssign(cs.id)}
                  >
                    {cs.assignee && cs.assignee !== 'Unassigned' ? 'Reassign' : 'Assign'} inspector
                  </button>
                )}
              </div>
              {[
                ['Assigned', cs.assignee],
                ['Created', cs.created],
                ['Due', cs.due],
                ['Risk score', String(cs.risk)],
                ['Flag count', String(cs.flags)],
                ['Consumer', cs.consumer],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border-light py-[7px] text-[11px] last:border-0">
                  <span className="text-text-dim">{k}</span>
                  <span className="font-semibold text-text">{v}</span>
                </div>
              ))}
            </div>

            {/* Lifecycle card */}
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 text-[11.5px] font-bold text-text">Case lifecycle</div>
              <div className="space-y-2">
                {steps.map((step) => (
                  <div key={step.label} className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${step.done ? 'bg-green text-white' : 'bg-border text-text-dim'}`}
                    >
                      {step.done ? '✓' : ''}
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-text">{step.label}</div>
                      <div className="text-[10px] text-text-dim">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ai flex-1 justify-center text-[11.5px]"
              >
                ⚖️ Court-ready dossier
              </button>
              <button
                type="button"
                className="btn btn-outline flex-1 justify-center text-[11px]"
              >
                📁 Download evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
