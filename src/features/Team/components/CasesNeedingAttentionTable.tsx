import { CaseStatusBadge } from '@/features/Cases/CaseStatusBadge'
import type { CaseRecord } from '@/features/Cases/types'

interface CasesNeedingAttentionTableProps {
  cases: CaseRecord[]
  readOnly: boolean
  onReassign: (cs: CaseRecord) => void
}

function riskClass(risk: number): string {
  if (risk >= 70) return 'risk-circle risk-high'
  if (risk >= 40) return 'risk-circle risk-mid'
  return 'risk-circle risk-low'
}

/**
 * "📋 Cases needing attention" table — the bottom card on the Team screen.
 * Pulls from CASES_LIST (slice(0,6)) and gives a Reassign → button per row
 * (disabled for read-only roles).
 */
export function CasesNeedingAttentionTable({
  cases,
  readOnly,
  onReassign,
}: CasesNeedingAttentionTableProps) {
  return (
    <div className="card">
      <div
        className="card-title"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>📋 Cases needing attention</span>
        <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 400 }}>
          Past SLA + escalated
        </span>
      </div>
      <div className="table-wrap">
        <table style={{ minWidth: 720 }}>
          <thead>
            <tr className="table-header">
              <th>Case</th>
              <th>Consumer</th>
              <th>Area</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Assigned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="table-row">
                <td
                  style={{
                    fontFamily: 'var(--mono)',
                    color: 'var(--id-text)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {c.id}
                </td>
                <td style={{ fontSize: 11 }}>{c.consumer || '—'}</td>
                <td style={{ color: 'var(--text-mid)', fontSize: 11 }}>{c.area}</td>
                <td>
                  <div
                    className={riskClass(c.risk)}
                    style={{ width: 24, height: 24, fontSize: 10 }}
                  >
                    {c.risk}
                  </div>
                </td>
                <td>
                  <CaseStatusBadge status={c.status} />
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-mid)' }}>{c.assignee || '—'}</td>
                <td>
                  {readOnly ? (
                    <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>—</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReassign(c)}
                      style={{
                        padding: '4px 10px',
                        background: 'var(--ai-gradient)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Reassign →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
