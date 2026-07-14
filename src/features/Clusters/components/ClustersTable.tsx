import { getRiskColor } from '@/shared/components/ui/StatusBadge'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { clusterStatusStyle } from '../data/clusters'
import type { Cluster } from '../types'

interface ClustersTableProps {
  clusters: Cluster[]
  scopeSuffix: string
  onRowClick: (cluster: Cluster) => void
}

/** "Active cases" table — exact column set from the prototype. */
export function ClustersTable({ clusters, scopeSuffix, onRowClick }: ClustersTableProps) {
  return (
    <div className="card">
      <div className="card-title">Active cases{scopeSuffix}</div>
      <div className="table-wrap">
        <table className="min-w-[920px]">
          <thead>
            <tr className="table-header">
              <th>Case ID</th>
              <th>Name</th>
              <th>Location</th>
              <th className="text-center">Members</th>
              <th className="text-center">Confirmed</th>
              <th>
                Pattern
                <ChartInfoButton chartId="ctc-pattern-column" />
              </th>
              <th>Started</th>
              <th>
                Est. loss
                <ChartInfoButton chartId="ctc-estloss-column" />
              </th>
              <th>
                Risk
                <ChartInfoButton chartId="ctc-risk-column" />
              </th>
              <th>Status</th>
              <th>Lead</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c) => {
              const badge = clusterStatusStyle(c.status)
              const riskColor = getRiskColor(c.risk)
              return (
                <tr
                  key={c.id}
                  className="table-row cursor-pointer"
                  onClick={() => onRowClick(c)}
                >
                  <td className="font-mono font-bold" style={{ color: 'var(--red)' }}>{c.id}</td>
                  <td className="font-semibold">{c.name.replace(/ Cluster$/, '')}</td>
                  <td className="text-[11px]">
                    {c.feeder}
                    <div className="text-[10px] text-text-dim">{c.dtr}</div>
                  </td>
                  <td className="text-center font-mono font-bold">{c.members}</td>
                  <td className="text-center font-mono" style={{ color: 'var(--green)' }}>
                    {c.confirmed}/{c.members}
                  </td>
                  <td className="text-[11px]">{c.pattern}</td>
                  <td className="text-[11px]">{c.started}</td>
                  <td className="font-mono font-bold" style={{ color: 'var(--red)' }}>{c.amount}</td>
                  <td>
                    <div
                      className="flex size-[26px] items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold"
                      style={{ background: `${riskColor}18`, borderColor: riskColor, color: riskColor }}
                    >
                      {c.risk}
                    </div>
                  </td>
                  <td>
                    <span
                      className="inline-block whitespace-nowrap rounded-lg px-2 py-[3px] text-[10px] font-bold"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="text-[11px]">{c.lead}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
