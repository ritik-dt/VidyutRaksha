import type { MouseEvent } from 'react'
import { topTheftFor, oldestPendingFor } from '@/features/Meters/data/meters'
import { formatIndian } from '@/shared/utils/formatters'
import type { EnrichedChildRef } from '@/shared/types/hierarchy'

interface DiscomRiskTableProps {
  childLabel: string
  children: EnrichedChildRef[]
  meters: number | undefined
  criticalCount: number
  highCount: number
  mediumCount: number
  flaggedCount: number
  onRowClick: (childId: string) => void
  onViewList: (childId: string) => void
  onViewAll: () => void
}

/**
 * Matches prototype's "{childLabel}-wise risk profile · ranked by Critical count" table —
 * sorted by critical desc, with a TOTAL row styled in navy.
 */
export function DiscomRiskTable({
  childLabel,
  children,
  meters,
  criticalCount,
  highCount,
  mediumCount,
  flaggedCount,
  onRowClick,
  onViewList,
  onViewAll,
}: DiscomRiskTableProps) {
  const sorted = [...children].sort((a, b) => (b.critical ?? 0) - (a.critical ?? 0))

  return (
    <div className="card mb-3.5">
      <div className="card-title mb-3.5 flex items-center justify-between text-[14px] font-bold">
        <span>{childLabel}-wise risk profile · ranked by Critical count</span>
        <span className="text-[11px] font-normal text-text-dim">
          {children.length} {childLabel}s
        </span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>{childLabel}</th>
              <th>Consumers</th>
              <th style={{ color: 'var(--red)' }} title="Consumers with risk score ≥ 80 — immediate priority">
                Critical (≥80)
              </th>
              <th style={{ color: 'var(--amber)' }} title="Consumers with risk score 60–79 — investigate this week">
                High (60–79)
              </th>
              <th style={{ color: 'var(--amber-dark)' }} title="Consumers with risk score 40–59 — investigate this month">
                Medium (40–59)
              </th>
              <th title="Most common AI-detected theft pattern at this entity">Top theft signature</th>
              <th title="Days since the oldest unaddressed flag was raised">Oldest unaddressed flag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((child) => {
              const tt = topTheftFor(child.id ?? child.name)
              const op = oldestPendingFor(child.id ?? child.name, child.loss ?? 0)
              const opColor = op > 14 ? 'var(--red)' : op > 7 ? 'var(--amber)' : 'var(--green)'
              return (
                <tr
                  key={child.id ?? child.name}
                  className="table-row cursor-pointer"
                  onClick={() => child.id && onRowClick(child.id)}
                >
                  <td className="font-semibold" style={{ color: 'var(--id-text)' }}>
                    {child.name}
                  </td>
                  <td className="font-mono">{formatIndian(child.meters)}</td>
                  <td className="font-mono font-bold" style={{ color: 'var(--red)' }}>
                    {formatIndian(child.critical)}
                  </td>
                  <td className="font-mono font-semibold" style={{ color: 'var(--amber)' }}>
                    {formatIndian(child.high)}
                  </td>
                  <td className="font-mono" style={{ color: 'var(--amber-dark)' }}>
                    {formatIndian(child.medium)}
                  </td>
                  <td>
                    <span className="text-[11px] font-semibold text-text">{tt.type}</span>{' '}
                    <span className="text-[10px] text-text-dim">({tt.pct}%)</span>
                  </td>
                  <td className="font-mono font-bold" style={{ color: opColor }}>
                    {op}d
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm whitespace-nowrap"
                      style={{ fontSize: '10px', padding: '3px 9px' }}
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation()
                        if (child.id) onViewList(child.id)
                      }}
                    >
                      View list ›
                    </button>
                  </td>
                </tr>
              )
            })}
            <tr style={{ background: 'var(--navy)', color: '#fff', fontWeight: 600 }}>
              <td>TOTAL</td>
              <td className="font-mono">{formatIndian(meters)}</td>
              <td className="font-mono">{formatIndian(criticalCount)}</td>
              <td className="font-mono">{formatIndian(highCount)}</td>
              <td className="font-mono">{formatIndian(mediumCount)}</td>
              <td>—</td>
              <td>—</td>
              <td>
                <button
                  type="button"
                  className="btn btn-ai btn-sm whitespace-nowrap"
                  style={{ fontSize: '10px', padding: '3px 9px' }}
                  onClick={onViewAll}
                >
                  View {formatIndian(flaggedCount)} →
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
