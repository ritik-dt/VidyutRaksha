import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesHierarchyRow, CasesStats } from './types'

interface Props {
  childLabel: string; scopeName: string; scopeId: string
  stats: CasesStats; rows: CasesHierarchyRow[]
  onDrill: (id: string) => void; onViewCases: (id: string) => void
}

export function CasesHierarchyTable({ childLabel, scopeName, scopeId, stats, rows, onDrill, onViewCases }: Props) {
  const { showToast } = useToast()
  if (!rows.length) return null

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{childLabel}-wise case workload (click to drill down)</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400 }}>
          {rows.length} {childLabel}s · sorted by past-SLA
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>{childLabel}</th>
              <th title="Total cases at this scope (open + closed)">Total cases</th>
              <th title="Cases past their due date — urgent attention" style={{ color: 'var(--red)' }}>Past SLA</th>
              <th title="Assigned to inspector, awaiting first visit">Open</th>
              <th title="In Progress + Escalated">In progress</th>
              <th title="Theft confirmed, assessment generated">Confirmed</th>
              <th title="Average days from creation to closure (target: 3 days)">Avg close</th>
              <th title="Recovered amount this fiscal">Recovery ₹</th>
              <th>Top inspector</th>
              <th style={{ textAlign: 'center', fontSize: '9.5px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.4px' }}>View cases</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const slowFlag = row.avgClose > 3.5
              const slaFlag  = row.pastSla > 0
              return (
                <tr
                  key={row.childId ?? row.id}
                  className="table-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onDrill(row.id)}
                >
                  <td style={{ fontWeight: 600, color: 'var(--id-text)' }}>{row.name}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(row.total)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: slaFlag ? 'var(--red)' : 'var(--text-dim)', fontWeight: slaFlag ? 700 : 500 }}>
                    {formatIndian(row.pastSla)}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', color: '#0EA5E9' }}>{formatIndian(row.open)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--amber)' }}>{formatIndian(row.inProgress)}</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--green)' }}>{formatIndian(row.confirmed)}</td>
                  <td style={{ fontWeight: 700, color: slowFlag ? 'var(--amber)' : 'var(--green)' }}>{row.avgClose} d</td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--ai-purple)', fontWeight: 600 }}>{fmtINR(row.recovery)}</td>
                  <td style={{ fontSize: '10.5px', color: 'var(--text-mid)' }}>{row.topInspector}</td>
                  <td style={{ textAlign: 'center' }}>
                    <ViewBtn
                      label={`View ${formatIndian(row.total)} →`}
                      onClick={(e) => { e.stopPropagation(); onViewCases(row.id) }}
                    />
                  </td>
                </tr>
              )
            })}
            {/* TOTAL ROW */}
            <tr style={{ background: 'var(--navy)', color: '#fff', fontWeight: 600 }}>
              <td>TOTAL · {scopeName}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(stats.total)}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(stats.pastSla)}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(stats.open)}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(stats.inProgress)}</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{formatIndian(stats.confirmed)}</td>
              <td>{stats.avgClose} d</td>
              <td style={{ fontFamily: 'var(--mono)' }}>{fmtINR(stats.recovery)}</td>
              <td>—</td>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-ai btn-sm"
                  style={{ fontSize: '10px', padding: '3px 9px', whiteSpace: 'nowrap' }}
                  onClick={(e) => { e.stopPropagation(); onViewCases(scopeId) }}
                >
                  View {formatIndian(stats.total)} →
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ViewBtn({ label, onClick }: { label: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 10px', background: 'transparent',
        border: '1px solid var(--border)', borderRadius: 6,
        fontSize: '10.5px', fontWeight: 600, color: '#0EA5E9',
        cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#0EA5E9'
        e.currentTarget.style.color = '#fff'
        e.currentTarget.style.borderColor = '#0EA5E9'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#0EA5E9'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {label}
    </button>
  )
}
