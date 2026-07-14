import { fmtINRFull } from '@/shared/utils/formatters'
import {
  deliveryBadgeStyle,
  responseBadgeStyle,
  typeBadgeStyle,
} from '../data/notices'
import type { RecentNotice } from '../types'

interface RecentNoticesTableProps {
  notices: RecentNotice[]
  onView: (notice: RecentNotice) => void
}

function Badge({ label, s }: { label: string; s: { bg: string; color: string; border: string } }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[10px] px-2 py-[3px] text-[10px] font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {label}
    </span>
  )
}

/** "Recent notices sent" table — 8 columns. */
export function RecentNoticesTable({ notices, onView }: RecentNoticesTableProps) {
  return (
    <div className="card">
      <div className="card-title">Recent notices sent</div>
      <div className="table-wrap">
        <table className="min-w-[860px]">
          <thead>
            <tr className="table-header">
              <th>Notice ID</th>
              <th>Consumer</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Sent on</th>
              <th>Delivery</th>
              <th>Response</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id} className="table-row">
                <td className="font-mono" style={{ color: 'var(--id-text, #0284c7)' }}>{n.id}</td>
                <td className="font-semibold">{n.consumer}</td>
                <td>
                  <Badge label={n.type} s={typeBadgeStyle(n.type)} />
                </td>
                <td className="font-mono font-bold whitespace-nowrap">
                  {n.amount === null ? '—' : fmtINRFull(n.amount)}
                </td>
                <td className="text-[11px]">{n.sentOn}</td>
                <td>
                  <Badge label={n.delivery} s={deliveryBadgeStyle()} />
                </td>
                <td>
                  <Badge label={n.response} s={responseBadgeStyle(n.response)} />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: 10 }}
                    onClick={() => onView(n)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
