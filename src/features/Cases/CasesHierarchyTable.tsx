import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/features/Dashboard/adapter'
import type { CasesHierarchyRow, CasesStats } from './types'

interface Props {
  childLabel: string; scopeName: string; scopeId: string
  stats: CasesStats; rows: CasesHierarchyRow[]
  onDrill: (id: string) => void; onViewCases: (id: string) => void
}

export function CasesHierarchyTable({ childLabel, scopeName, scopeId, stats, rows, onDrill, onViewCases }: Props) {
  if (!rows.length) return null

  return (
    <div className="card">
      <div className="card-title flex items-center justify-between">
        <span>{childLabel}-wise case workload (click to drill down)</span>
        <span className="text-[11px] font-normal text-text-dim">
          {rows.length} {childLabel}s · sorted by past-SLA
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>{childLabel}</th>
              <th title="Total cases at this scope (open + closed)">Total cases</th>
              <th title="Cases past their due date — urgent attention" className="text-red">Past SLA</th>
              <th title="Assigned to inspector, awaiting first visit">Open</th>
              <th title="In Progress + Escalated">In progress</th>
              <th title="Theft confirmed, assessment generated">Confirmed</th>
              <th title="Average days from creation to closure (target: 3 days)">Avg close</th>
              <th title="Recovered amount this fiscal">Recovery ₹</th>
              <th>Top inspector</th>
              <th className="text-center text-[9.5px] tracking-[0.4px] text-text-dim uppercase">View cases</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const slowFlag = row.avgClose > 3.5
              const slaFlag  = row.pastSla > 0
              return (
                <tr
                  key={row.id}
                  className="table-row cursor-pointer"
                  onClick={() => onDrill(row.id)}
                >
                  <td className="font-semibold text-id-text">{row.name}</td>
                  <td className="font-mono">{formatIndian(row.total)}</td>
                  <td className={`font-mono ${slaFlag ? 'font-bold text-red' : 'font-medium text-text-dim'}`}>
                    {formatIndian(row.pastSla)}
                  </td>
                  <td className="font-mono text-[#0EA5E9]">{formatIndian(row.open)}</td>
                  <td className="font-mono text-amber">{formatIndian(row.inProgress)}</td>
                  <td className="font-mono text-green">{formatIndian(row.confirmed)}</td>
                  <td className={`font-bold ${slowFlag ? 'text-amber' : 'text-green'}`}>{row.avgClose} d</td>
                  <td className="font-mono font-semibold text-ai-purple">{fmtINR(row.recovery)}</td>
                  <td className="text-[10.5px] text-text-mid">{row.topInspector}</td>
                  <td className="text-center">
                    <ViewBtn
                      label={`View ${formatIndian(row.total)} →`}
                      onClick={(e) => { e.stopPropagation(); onViewCases(row.id) }}
                    />
                  </td>
                </tr>
              )
            })}
            {/* TOTAL ROW */}
            <tr className="bg-[var(--navy)] font-semibold text-white">
              <td>TOTAL · {scopeName}</td>
              <td className="font-mono">{formatIndian(stats.total)}</td>
              <td className="font-mono">{formatIndian(stats.pastSla)}</td>
              <td className="font-mono">{formatIndian(stats.open)}</td>
              <td className="font-mono">{formatIndian(stats.inProgress)}</td>
              <td className="font-mono">{formatIndian(stats.confirmed)}</td>
              <td>{stats.avgClose} d</td>
              <td className="font-mono">{fmtINR(stats.recovery)}</td>
              <td>—</td>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-ai btn-sm px-[9px] py-[3px] text-[10px] whitespace-nowrap"
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
      className="cursor-pointer rounded-md border border-border px-2.5 py-1 text-[10.5px] font-semibold whitespace-nowrap text-[#0EA5E9] transition-all duration-150 hover:border-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
    >
      {label}
    </button>
  )
}
