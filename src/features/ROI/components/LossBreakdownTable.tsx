import type { Addressable, LossBucket, LossTotal } from '../types'

interface LossBreakdownTableProps {
  buckets: LossBucket[]
  total: LossTotal
}

const ADDR_LABEL: Record<Addressable, string> = {
  yes: '✓ YES',
  partial: 'PARTIAL',
  no: '— NO',
}

/** "Where the ₹9,676 Cr goes" table with AI-addressable badges + total row. */
export function LossBreakdownTable({ buckets, total }: LossBreakdownTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">Where the ₹9,676 Cr goes</div>
      <div className="roi-table-scroll">
        <table className="roi-table">
          <thead>
            <tr>
              <th>Loss bucket</th>
              <th className="roi-num">₹ Cr · annual</th>
              <th className="roi-num">Share</th>
              <th>AI addressable?</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((b) => (
              <tr key={b.bucket}>
                <td className="roi-bucket">{b.bucket}</td>
                <td className="roi-num roi-mono">{b.value}</td>
                <td className="roi-num roi-mono-dim">{b.share}</td>
                <td>
                  <span className={`roi-addr-badge roi-addr-${b.addressable}`}>
                    {ADDR_LABEL[b.addressable]}
                  </span>
                  <span className="roi-addr-note">{b.note}</span>
                </td>
              </tr>
            ))}
            <tr className="roi-total-row">
              <td>{total.label}</td>
              <td className="roi-num roi-mono">{total.value}</td>
              <td className="roi-num roi-mono">{total.share}</td>
              <td className="roi-total-note">{total.note}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
