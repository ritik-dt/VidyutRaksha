import { formatIndian } from '@/shared/utils/formatters'
import type { UnbilledReasonRow } from '../data/revenue'

interface UnbilledReasonsTableProps {
  rows: UnbilledReasonRow[]
}

const BADGE_COLORS: Record<UnbilledReasonRow['actionBadge'], string> = {
  confirmed: 'var(--red)',
  assigned:  'var(--amber)',
  new:       'var(--id-text, #0284c7)',
  active:    'var(--green)',
}

const IMPACT_COLORS: Record<Required<UnbilledReasonRow>['revenueImpactColor'], string> = {
  red:   'var(--red)',
  amber: 'var(--amber)',
  dim:   'var(--text-dim)',
}

const REASON_COLORS: Record<Required<UnbilledReasonRow>['reasonColor'], string> = {
  red:   'var(--red)',
  amber: 'var(--amber)',
}

/** Unbilled meter reasons — 5 columns × 4 rows (direct port). */
export function UnbilledReasonsTable({ rows }: UnbilledReasonsTableProps) {
  return (
    <div className="card">
      <div className="card-title">Unbilled meter reasons</div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>Reason</th>
              <th>Count</th>
              <th>% of unbilled</th>
              <th>Revenue impact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const reasonColor = row.reasonColor ? REASON_COLORS[row.reasonColor] : undefined
              const impactColor = row.revenueImpactColor ? IMPACT_COLORS[row.revenueImpactColor] : undefined
              const badgeColor = BADGE_COLORS[row.actionBadge]
              return (
                <tr key={row.reason} className="table-row">
                  <td className="font-semibold" style={reasonColor ? { color: reasonColor } : undefined}>
                    {row.reason}
                  </td>
                  <td className="font-mono text-[11px]">{formatIndian(row.count)}</td>
                  <td className="font-mono text-[11px]">{row.pctOfUnbilled}</td>
                  <td className="font-mono text-[11px]" style={impactColor ? { color: impactColor } : undefined}>
                    {row.revenueImpact}
                  </td>
                  <td>
                    <span
                      className="inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] text-[10px] font-semibold"
                      style={{
                        background: `${badgeColor}18`,
                        color: badgeColor,
                        borderColor: `${badgeColor}55`,
                      }}
                    >
                      {row.action}
                    </span>
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
