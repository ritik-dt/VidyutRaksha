import type { AtRiskDtRow, ForecastHorizon } from '../types'

interface AtRiskDtTableProps {
  rows: AtRiskDtRow[]
  /** Horizon label for the card title, e.g. "next quarter". */
  horizonLabel: string
  /** Raw horizon id for the "Projected (…)" column header, e.g. "3m". */
  horizon: ForecastHorizon
}

const MONO = { fontFamily: 'var(--mono)' } as const

/**
 * "⚠ DTs predicted to exceed 90% capacity" table. Rows are fixed (independent of
 * horizon); only the card title + the "Projected (…)" header react to horizon —
 * exactly as in the prototype.
 */
export function AtRiskDtTable({ rows, horizonLabel, horizon }: AtRiskDtTableProps) {
  return (
    <div className="card">
      <div className="card-title" style={{ color: 'var(--red)' }}>
        ⚠ DTs predicted to exceed 90% capacity within {horizonLabel}
      </div>
      <div className="table-wrap">
        <table className="min-w-[720px]">
          <thead>
            <tr className="table-header">
              <th>DT</th>
              <th>Feeder</th>
              <th>Current loading</th>
              <th>Growth rate</th>
              <th>Projected ({horizon})</th>
              <th>Days to overload</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dt} className="table-row">
                <td style={{ fontWeight: 700, color: 'var(--id-text)', ...MONO }}>{r.dt}</td>
                <td>{r.feeder}</td>
                <td style={{ ...MONO, color: r.currentColor }}>{r.currentLoading}</td>
                <td style={{ ...MONO, color: r.growthColor }}>{r.growthRate}</td>
                <td style={{ ...MONO, color: r.projectedColor, fontWeight: 700 }}>{r.projected}</td>
                <td style={{ ...MONO, color: r.daysColor, fontWeight: 700 }}>{r.daysToOverload}</td>
                <td>
                  <span className={`badge badge-${r.actionBadge}`}>{r.action}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
