import { formatIndian } from '@/shared/utils/formatters'
import { PF_PENALTY_ROWS } from '../data/pq'

/** PF penalty — top consumers (recoverable revenue). 4 rows, direct port. */
export function PfPenaltyTable() {
  return (
    <div className="card">
      <div className="card-title">PF penalty — top consumers (recoverable revenue)</div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>Consumer</th>
              <th>Category</th>
              <th>Avg PF</th>
              <th>kVAh</th>
              <th>kWh</th>
              <th>Penalty est.</th>
            </tr>
          </thead>
          <tbody>
            {PF_PENALTY_ROWS.map((row) => {
              const pfColor = row.avgPfColor === 'red' ? 'var(--red)' : 'var(--amber)'
              const penaltyColor = row.penaltyColor === 'red' ? 'var(--red)' : 'var(--amber)'
              return (
                <tr key={row.consumer} className="table-row">
                  <td className="font-semibold">{row.consumer}</td>
                  <td>{row.category}</td>
                  <td className="font-mono" style={{ color: pfColor }}>{row.avgPf.toFixed(2)}</td>
                  <td className="font-mono">{formatIndian(row.kvah)}</td>
                  <td className="font-mono">{formatIndian(row.kwh)}</td>
                  <td className="font-mono font-bold" style={{ color: penaltyColor }}>
                    ₹{formatIndian(row.penaltyEst)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
