import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/features/Dashboard/adapter'
import type { CasesHierarchyRow } from './types'
import type { CasesStats } from './types'

interface CasesHierarchyTableProps {
  childLabel: string
  scopeName: string
  stats: CasesStats
  rows: CasesHierarchyRow[]
  onDrill: (childId: string) => void
  onViewCases: (childId: string) => void
}

export function CasesHierarchyTable({
  childLabel,
  scopeName,
  stats,
  rows,
  onDrill,
  onViewCases,
}: CasesHierarchyTableProps) {
  if (rows.length === 0) return null

  return (
    <div className="card">
      <div className="card-title mb-3 flex items-center justify-between">
        <span className="text-[14px] font-bold">{childLabel}-wise case workload (click to drill down)</span>
        <span className="text-[11px] font-normal text-text-dim">
          {formatIndian(rows.length)} {childLabel.toLowerCase()}s · sorted by past-SLA
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>{childLabel}</th>
              <th>Total cases</th>
              <th className="text-red-500">Past SLA</th>
              <th>Open</th>
              <th>In progress</th>
              <th>Confirmed</th>
              <th>Avg close</th>
              <th>Recovery</th>
              <th>Top inspector</th>
              <th style={{ textAlign: 'center' }}>View cases</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const slowFlag = row.avgClose > 3.5
              const slaFlag = row.pastSla > 0

              return (
                <tr
                  key={row.id}
                  className="table-row cursor-pointer"
                  onClick={() => onDrill(row.id)}
                >
                  <td className="font-semibold text-id-text">{row.name}</td>
                  <td className="font-mono">{formatIndian(row.total)}</td>
                  <td
                    className="font-mono"
                    style={{
                      color: slaFlag ? 'var(--red)' : 'var(--text-dim)',
                      fontWeight: slaFlag ? 700 : 500,
                    }}
                  >
                    {formatIndian(row.pastSla)}
                  </td>
                  <td className="font-mono" style={{ color: '#0EA5E9' }}>
                    {formatIndian(row.open)}
                  </td>
                  <td className="font-mono" style={{ color: 'var(--amber)' }}>
                    {formatIndian(row.inProgress)}
                  </td>
                  <td className="font-mono" style={{ color: 'var(--green)' }}>
                    {formatIndian(row.confirmed)}
                  </td>
                  <td style={{ fontWeight: 700, color: slowFlag ? 'var(--amber)' : 'var(--green)' }}>
                    {row.avgClose} d
                  </td>
                  <td className="font-mono font-semibold" style={{ color: 'var(--ai-purple)' }}>
                    {fmtINR(row.recovery)}
                  </td>
                  <td className="text-[10.5px] text-text-mid">{row.topInspector}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '10px', padding: '3px 9px' }}
                      onClick={(event) => {
                        event.stopPropagation()
                        onViewCases(row.id)
                      }}
                    >
                      View {formatIndian(row.total)} →
                    </button>
                  </td>
                </tr>
              )
            })}
            <tr className="bg-navy text-white">
              <td className="font-semibold">{scopeName.toUpperCase()}</td>
              <td className="font-mono">{formatIndian(stats.total)}</td>
              <td className="font-mono">{formatIndian(stats.pastSla)}</td>
              <td className="font-mono">{formatIndian(stats.open)}</td>
              <td className="font-mono">{formatIndian(stats.inProgress)}</td>
              <td className="font-mono">{formatIndian(stats.confirmed)}</td>
              <td>{stats.avgClose} d</td>
              <td className="font-mono">{fmtINR(stats.recovery)}</td>
              <td>—</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
