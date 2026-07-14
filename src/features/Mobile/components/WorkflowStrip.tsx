import { WORKFLOW_STEPS } from '../data/mobile'

/** "Inspection workflow on mobile (8 steps)" card — horizontal-scroll strip of steps. */
export function WorkflowStrip() {
  return (
    <div className="card">
      <div className="card-title">Inspection workflow on mobile (8 steps)</div>
      <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
        {WORKFLOW_STEPS.map((s) => (
          <div
            key={s.n}
            className="shrink-0 rounded-lg p-2.5 text-center"
            style={{
              flex: 1,
              minWidth: 110,
              background: 'var(--bg)',
              borderTop: '3px solid var(--ai-purple)',
            }}
          >
            <div
              className="mx-auto mb-1.5 flex items-center justify-center text-[12px] font-bold text-white"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--ai-gradient)',
              }}
            >
              {s.n}
            </div>
            <div className="text-[11px] font-bold">{s.title}</div>
            <div className="mt-0.5 text-[10px] text-text-dim">{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
