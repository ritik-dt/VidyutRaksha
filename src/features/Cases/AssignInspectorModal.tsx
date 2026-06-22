import { useState } from 'react'
import { INSPECTORS, type CaseRecord } from '@/features/Cases/data/cases'
import { useToast } from '@/shared/context/ToastContext'

interface AssignInspectorModalProps {
  caseRecord: CaseRecord
  onClose: () => void
}

const INSPECTOR_DETAILS = INSPECTORS.map((name, i) => ({
  name,
  area: ['Bhelupur', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Aliganj', 'Hazratganj', 'Rajajipuram', 'Mahanagar'][i % 8],
  load: Math.floor(Math.random() * 8) + 2,
  rating: (3.8 + Math.random() * 1.2).toFixed(1),
}))

export function AssignInspectorModal({ caseRecord: cs, onClose }: AssignInspectorModalProps) {
  const { showToast } = useToast()
  const [selected, setSelected] = useState<string | null>(cs.assignee !== 'Unassigned' ? cs.assignee : null)

  function handleAssign() {
    if (!selected) return
    showToast({
      type: 'success',
      title: '✓ Inspector assigned',
      message: `${selected} assigned to case ${cs.id}`,
      duration: 3500,
    })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="fixed left-1/2 top-1/2 z-[60] w-[480px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-2xl p-4"
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <div className="font-bold text-white">Assign inspector</div>
            <div className="text-[11px] text-[rgba(255,255,255,0.5)]">Case {cs.id} · Meter #{cs.meter}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-3 text-[11.5px] font-semibold text-text-mid">
            Select inspector for this case:
          </div>

          <div className="space-y-2">
            {INSPECTOR_DETAILS.map((insp) => {
              const isSelected = selected === insp.name
              return (
                <button
                  key={insp.name}
                  type="button"
                  onClick={() => setSelected(insp.name)}
                  className="w-full rounded-xl border p-3 text-left transition-all duration-150"
                  style={{
                    borderColor: isSelected ? 'var(--ai-purple)' : 'var(--border)',
                    background: isSelected ? 'rgba(124,58,237,0.07)' : 'var(--bg)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-white text-[12px]"
                        style={{ background: isSelected ? 'var(--ai-purple)' : 'var(--navy-light)' }}
                      >
                        {insp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-text">{insp.name}</div>
                        <div className="text-[10.5px] text-text-dim">{insp.area} area</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-mono text-text-mid">{insp.load} active cases</div>
                      <div className="text-[10px] text-text-dim">⭐ {insp.rating}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn btn-outline flex-1"
              style={{ justifyContent: 'center' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-ai flex-1"
              style={{ justifyContent: 'center' }}
              onClick={handleAssign}
              disabled={!selected}
            >
              Assign {selected ? `→ ${selected.split(' ')[0]}` : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
