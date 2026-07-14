import { useNavigate } from 'react-router-dom'
import { formatIndian } from '@/shared/utils/formatters'
import { getRiskColor } from '@/shared/components/ui/StatusBadge'
import { CaseStatusBadge } from './CaseStatusBadge'
import type { CaseRecord } from './types'

interface CasesLeafTableProps {
  rows: CaseRecord[]
  total: number
  onViewAll: () => void
}

/**
 * "Cases at this scope" table shown at the DTR / terminal scope — mirrors the
 * prototype's renderCases() consumer-level branch: a sample of the case list
 * with a "view all →" link that opens the full drawer. Rows open case detail.
 */
export function CasesLeafTable({ rows, total, onViewAll }: CasesLeafTableProps) {
  const navigate = useNavigate()

  return (
    <div className="card">
      <div className="card-title flex items-center justify-between">
        <span>Cases at this scope</span>
        <span className="text-[11px] font-normal text-text-dim">
          Showing {formatIndian(rows.length)} of {formatIndian(total)} · sample ·{' '}
          <button
            type="button"
            onClick={onViewAll}
            className="cursor-pointer text-ai-purple underline"
          >
            view all →
          </button>
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="p-10 text-center text-text-dim">
          <div className="mb-2 text-[32px] opacity-50">📋</div>
          <div className="font-semibold text-text-mid">
            No cases match this filter
          </div>
          <div className="mt-1 text-[11px]">
            Try clearing the filter to see all cases
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="table-header">
                <th>Case</th>
                <th>Meter</th>
                <th>Risk</th>
                <th>Consumer / Activity</th>
                <th>Area</th>
                <th>Assigned</th>
                <th>Due</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const riskColor = getRiskColor(c.risk)
                const consumerShort =
                  c.consumer.length > 30
                    ? `${c.consumer.substring(0, 30)}…`
                    : c.consumer
                return (
                  <tr
                    key={c.id}
                    className="table-row cursor-pointer"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <td className="font-mono text-[11px] font-semibold text-id-text">
                      {c.id}
                      {c._real && (
                        <span
                          className="ml-[5px] inline-block rounded-lg border px-1.5 py-px align-middle text-[8.5px] font-extrabold tracking-[0.3px]"
                          style={{
                            background: 'rgba(40,167,69,.12)',
                            color: 'var(--green)',
                            borderColor: 'rgba(40,167,69,.3)',
                          }}
                        >
                          ✓ REAL
                        </span>
                      )}
                    </td>
                    <td className="font-mono">{c.meter}</td>
                    <td>
                      <div
                        className="flex size-7 items-center justify-center rounded-full border-2 font-mono text-[11px] font-extrabold"
                        style={{
                          background: `${riskColor}18`,
                          borderColor: riskColor,
                          color: riskColor,
                        }}
                      >
                        {c.risk}
                      </div>
                    </td>
                    <td>
                      <div className="text-[11px] font-semibold text-text">
                        {consumerShort}
                      </div>
                      {c._real && (c._activity || c._load) && (
                        <div className="mt-px text-[9.5px] text-text-dim">
                          {c._activity ?? ''}
                          {c._load != null
                            ? ` · ${c._load}${c._load_unit ?? ''}`
                            : ''}
                        </div>
                      )}
                    </td>
                    <td className="text-[11px] text-text-mid">{c.area}</td>
                    <td className="text-[11px] text-text-mid">{c.assignee}</td>
                    <td className="text-[11px] text-text-dim">{c.due}</td>
                    <td>
                      <CaseStatusBadge status={c.status} />
                    </td>
                    <td className="text-text-dim">›</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
