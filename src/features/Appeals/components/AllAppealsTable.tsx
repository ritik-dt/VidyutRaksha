import { statusBadgeColor } from '../data/appeals'
import type { Appeal } from '../types'

interface AllAppealsTableProps {
  appeals: Appeal[]
  onReview: (a: Appeal) => void
}

/** "All appeals" table — exact 9-column port of the prototype. */
export function AllAppealsTable({ appeals, onReview }: AllAppealsTableProps) {
  return (
    <div className="card">
      <div className="card-title">All appeals</div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>Appeal ID</th>
              <th>Consumer</th>
              <th>Case</th>
              <th>Amount</th>
              <th>Filed</th>
              <th>Status</th>
              <th>Hearing</th>
              <th>Grounds</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appeals.map((a) => {
              const badgeBg = statusBadgeColor(a.status)
              return (
                <tr key={a.id} className="table-row">
                  <td
                    className="font-mono font-bold"
                    style={{ color: 'var(--id-text, #0284c7)' }}
                  >
                    {a.id}
                  </td>
                  <td className="text-[11px] font-semibold">{a.consumer}</td>
                  <td className="font-mono text-[11px]">{a.case}</td>
                  <td className="font-mono font-bold whitespace-nowrap">{a.amount}</td>
                  <td className="text-[11px]">{a.filed}</td>
                  <td>
                    <span
                      className="inline-block whitespace-nowrap rounded-[10px] px-2 py-[3px] text-[9px] font-bold text-white"
                      style={{ background: badgeBg }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-[11px]">{a.hearing}</td>
                  <td
                    className="text-[10px] text-text-mid"
                    style={{ maxWidth: 220 }}
                  >
                    {a.grounds}
                    {a.outcome && (
                      <div
                        className="mt-0.5 font-bold"
                        style={{ color: 'var(--green)' }}
                      >
                        → {a.outcome}
                      </div>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 10 }}
                      onClick={() => onReview(a)}
                    >
                      Review
                    </button>
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
