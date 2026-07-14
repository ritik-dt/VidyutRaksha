import type { ForecastHorizon } from '../types'

interface HorizonToggleProps {
  horizon: ForecastHorizon
  pills: { id: ForecastHorizon; label: string }[]
  onChange: (h: ForecastHorizon) => void
}

/**
 * Segmented horizon control (1 month / 3 months / 6 months / 1 year). Port of
 * the prototype's `pill()` helper + wrapper — active pill is ai-purple filled.
 */
export function HorizonToggle({ horizon, pills, onChange }: HorizonToggleProps) {
  return (
    <div
      className="forecast-horizon-toggle flex gap-1 rounded-lg border p-[3px]"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      {pills.map((p) => {
        const active = horizon === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className="btn btn-sm cursor-pointer rounded-md border"
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              background: active ? 'var(--ai-purple-light)' : 'var(--card)',
              color: active ? 'var(--ai-purple)' : 'var(--text-mid)',
              borderColor: active ? 'var(--ai-purple)' : 'var(--border)',
              fontWeight: active ? 700 : 500,
            }}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
