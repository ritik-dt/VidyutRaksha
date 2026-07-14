import type { CostRow, CostTotal } from '../types'

interface CostStackTableProps {
  rows: CostRow[]
  total: CostTotal
  note: string
}

/** 5-year cost stack table with total row + note. */
export function CostStackTable({ rows, total, note }: CostStackTableProps) {
  return (
    <div className="card">
      <div className="card-title">5-year cost stack (₹ Cr)</div>
      <div className="roi-table-scroll">
        <table className="roi-table roi-table-cost" style={{ fontSize: 11, marginTop: 6 }}>
          <thead>
            <tr>
              <th>Cost head</th>
              <th className="roi-num">Yr 1</th>
              <th className="roi-num">Yr 2</th>
              <th className="roi-num">Yr 3-5</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cost}>
                <td style={{ color: 'var(--text)' }}>{r.cost}</td>
                <td className="roi-num roi-mono" style={{ fontWeight: 600 }}>{r.y1}</td>
                <td className="roi-num roi-mono" style={{ fontWeight: 600 }}>{r.y2}</td>
                <td className="roi-num roi-mono" style={{ fontWeight: 600 }}>{r.y3}</td>
              </tr>
            ))}
            <tr className="roi-cost-total">
              <td>{total.label}</td>
              <td className="roi-num roi-mono">{total.y1}</td>
              <td className="roi-num roi-mono">{total.y2}</td>
              <td className="roi-num roi-mono">{total.y3}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="roi-cost-note" dangerouslySetInnerHTML={{ __html: note }} />
    </div>
  )
}
