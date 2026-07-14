import { WHAT_IF_PRESETS, type WhatIfState } from '../data/whatIfData'

interface WhatIfPresetsProps {
  onApply: (state: WhatIfState) => void
}

/** Preset scenarios card (bottom-right in the sliders grid). */
export function WhatIfPresets({ onApply }: WhatIfPresetsProps) {
  return (
    <div className="card" style={{ background: 'rgba(23,162,184,0.04)' }}>
      <div className="mb-1.5 text-[12.5px] font-bold">📋 Preset scenarios</div>
      <div className="flex flex-col gap-1.5">
        {WHAT_IF_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="btn btn-outline btn-sm justify-start text-left"
            style={{ fontSize: 11 }}
            onClick={() => onApply(p.state)}
          >
            {p.emoji} <strong>{p.title}</strong> {p.desc}
          </button>
        ))}
      </div>
    </div>
  )
}
