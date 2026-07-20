import { EmptyState } from '@/shared/components/ui/EmptyState'
import type { AttentionRow } from '../types'

interface AttentionTableProps {
  rows: AttentionRow[]
  title: string
}

/** Areas with the most stopped meters, plus likely cause and recommended action. */
export function AttentionTable({ rows, title }: AttentionTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title text-[var(--red)]">{title}</div>

      {rows.length === 0 ? (
        <EmptyState title="No areas match this filter" description="Clear the filter to see all areas requiring attention." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Area</th>
                <th>Stopped meters</th>
                <th>% of total</th>
                <th>Last comm.</th>
                <th>Likely cause</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area} className="table-row">
                  <td className="font-semibold">{r.area}</td>
                  <td className="font-[var(--mono)]" style={{ color: r.countColor }}>
                    {r.stopped}
                  </td>
                  <td className="font-[var(--mono)]">{r.pct}</td>
                  <td className="font-[var(--mono)] text-[var(--text-dim)]">{r.lastComm}</td>
                  <td>
                    <span className={`badge ${r.causeBadge}`}>{r.cause}</span>
                  </td>
                  <td>
                    <span className={`badge ${r.actionBadge}`}>{r.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
