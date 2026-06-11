import { useNavigate } from 'react-router-dom'
import { useScope } from '@/context/ScopeContext'
import { formatIndian } from '@/utils/formatters'
import { getPathForScreen } from '@/utils/navigation'
import {
  enrichLevel,
  fmtINR,
  getChildLabel,
  getHitRateColor,
  getLossColor,
  isConsumerLevel,
} from './dashboardAdapter'
import type { EnrichedChildRef } from './types'

function RiskCircle({ risk }: { risk: number }) {
  const color =
    risk >= 70 ? 'var(--red)' : risk >= 40 ? 'var(--amber)' : 'var(--green)'

  return (
    <div
      className="risk-circle flex size-7 items-center justify-center rounded-full border-2 font-mono text-[10px] font-extrabold"
      style={{
        background: `${color}18`,
        borderColor: color,
        color,
      }}
    >
      {risk}
    </div>
  )
}

export default function DashboardTables() {
  const navigate = useNavigate()
  const { currentNode, drillToChild } = useScope()

  if (!currentNode) {
    return null
  }

  const level = enrichLevel(currentNode)
  const childLabel = getChildLabel(level.type)
  const consumerLevel = isConsumerLevel(level.type)
  const realizationRate =
    (level.assessed ?? 0) > 0
      ? (((level.realized ?? 0) / (level.assessed ?? 1)) * 100).toFixed(1)
      : '0.0'

  if (consumerLevel) {
    const children = [...(level.children ?? [])].sort(
      (a, b) => (b.risk ?? 0) - (a.risk ?? 0),
    )

    return (
      <div className="card">
        <div className="card-title mb-3.5 flex items-center justify-between text-[14px] font-bold">
          <span>Consumers under {level.name} (click for consumer detail)</span>
          <span className="text-[11px] font-normal text-text-dim">
            {children.length} consumers
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Risk</th>
                <th>Consumer</th>
                <th>Connection #</th>
                <th>Category</th>
                <th>Tariff</th>
                <th>Load</th>
                <th>kWh drop</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {children.map((consumer) => (
                <tr
                  key={consumer.meter ?? consumer.name}
                  className="table-row cursor-pointer"
                  onClick={() => navigate(getPathForScreen('meterDetail', '1849966'))}
                >
                  <td>
                    <RiskCircle risk={consumer.risk ?? 0} />
                  </td>
                  <td className="font-semibold">{consumer.name}</td>
                  <td className="font-mono text-id-text">{consumer.meter}</td>
                  <td className="text-[11px] text-text-mid">{consumer.cat}</td>
                  <td className="font-mono">{consumer.tariff}</td>
                  <td className="font-mono">{consumer.load}</td>
                  <td
                    className="font-mono font-bold"
                    style={{
                      color:
                        (consumer.drop ?? 0) < -30
                          ? 'var(--red)'
                          : (consumer.drop ?? 0) < -15
                            ? 'var(--amber)'
                            : 'var(--text)',
                    }}
                  >
                    {consumer.drop}%
                  </td>
                  <td className="font-mono">{consumer.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const children = [...(level.children ?? [])].sort(
    (a, b) => (b.loss ?? 0) - (a.loss ?? 0),
  ) as EnrichedChildRef[]

  return (
    <div className="card">
      <div className="card-title mb-3.5 flex items-center justify-between text-[14px] font-bold">
        <span>
          {childLabel}-wise performance (click to drill down)
        </span>
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
              <th>AI flagged</th>
              <th>Critical</th>
              <th>Confirmed</th>
              <th>Hit rate</th>
              <th>AT&C loss</th>
              <th>Assessment</th>
              <th>Realization</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {children.map((child) => {
              const realRate =
                (child.assessed ?? 0) > 0
                  ? (((child.realized ?? 0) / (child.assessed ?? 1)) * 100).toFixed(0)
                  : '0'

              return (
                <tr
                  key={child.id}
                  className="table-row cursor-pointer"
                  onClick={() => drillToChild(child.id)}
                >
                  <td className="font-semibold text-id-text">{child.name}</td>
                  <td className="font-mono">{formatIndian(child.meters)}</td>
                  <td className="font-mono text-red">
                    {formatIndian(child.flagged)}
                  </td>
                  <td className="font-mono font-bold text-red">
                    {formatIndian(child.critical)}
                  </td>
                  <td className="font-mono text-green">
                    {formatIndian(child.confirmed)}
                  </td>
                  <td
                    className="font-bold"
                    style={{ color: getHitRateColor(child.hitRate ?? 0) }}
                  >
                    {child.hitRate}%
                  </td>
                  <td
                    className="font-bold"
                    style={{ color: getLossColor(child.loss ?? 0) }}
                  >
                    {child.loss}%
                  </td>
                  <td className="font-mono font-semibold text-ai-purple">
                    {fmtINR(child.assessed)}
                  </td>
                  <td className="font-mono font-semibold text-green">
                    {fmtINR(child.realized)}
                    <span className="ml-0.5 text-[9px] text-text-dim">
                      ({realRate}%)
                    </span>
                  </td>
                  <td className="font-semibold text-ai-purple">›</td>
                </tr>
              )
            })}

            <tr className="bg-navy font-semibold text-white">
              <td>TOTAL</td>
              <td className="font-mono">{formatIndian(level.meters)}</td>
              <td className="font-mono">{formatIndian(level.flagged)}</td>
              <td className="font-mono">{formatIndian(level.critical)}</td>
              <td className="font-mono">{formatIndian(level.confirmed)}</td>
              <td>{level.hitRate}%</td>
              <td>{level.loss}%</td>
              <td className="font-mono">{fmtINR(level.assessed)}</td>
              <td className="font-mono">
                {fmtINR(level.realized)} ({realizationRate}%)
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
