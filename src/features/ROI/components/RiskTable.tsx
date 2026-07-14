import type { RiskRow } from '../types'

interface RiskTableProps {
  risks: RiskRow[]
}

/** "What could go wrong" risk table with colored likelihood badges. */
export function RiskTable({ risks }: RiskTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="roi-table-scroll">
        <table className="roi-table">
          <thead>
            <tr>
              <th>Risk</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.risk}>
                <td className="roi-bucket">{r.risk}</td>
                <td>
                  <span className={`roi-risk-like roi-tone-${r.likelihoodTone}`}>
                    {r.likelihood}
                  </span>
                </td>
                <td className="roi-risk-impact">{r.impact}</td>
                <td className="roi-risk-mit">{r.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
