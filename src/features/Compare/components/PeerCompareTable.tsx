import { formatIndian } from '@/shared/utils/formatters'
import type { PeerFeeder } from '../types'

interface PeerCompareTableProps {
  peers: PeerFeeder[]
}

/** Peer comparison table — 7 metric rows across the selected peers (screenshot 4). */
export function PeerCompareTable({ peers }: PeerCompareTableProps) {
  return (
    <div className="table-wrap mt-3.5">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th>Metric</th>
            {peers.map((p) => (
              <th key={p.id}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="table-row">
            <td className="font-semibold">Meters</td>
            {peers.map((p) => (
              <td key={p.id} className="font-mono">{formatIndian(p.meters)}</td>
            ))}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">AI flagged</td>
            {peers.map((p) => (
              <td key={p.id} className="font-mono" style={{ color: 'var(--red)' }}>
                {formatIndian(p.flagged)}
              </td>
            ))}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">Flag rate</td>
            {peers.map((p) => (
              <td key={p.id} className="font-mono">{p.flagRatePct}</td>
            ))}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">Hit rate</td>
            {peers.map((p) => {
              const color = p.hitRatePct >= 60 ? 'var(--green)' : 'var(--amber)'
              return (
                <td key={p.id} className="font-bold" style={{ color }}>
                  {p.hitRatePct}%
                </td>
              )
            })}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">AT&C loss</td>
            {peers.map((p) => {
              const color =
                p.atcLossPct > 22 ? 'var(--red)' : p.atcLossPct > 19 ? 'var(--amber)' : 'var(--green)'
              return (
                <td key={p.id} className="font-bold" style={{ color }}>
                  {p.atcLossPct}%
                </td>
              )
            })}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">SAIDI (hrs/mo)</td>
            {peers.map((p) => {
              const color =
                p.saidiHrs > 20 ? 'var(--red)' : p.saidiHrs > 15 ? 'var(--amber)' : 'var(--green)'
              return (
                <td key={p.id} className="font-mono" style={{ color }}>
                  {p.saidiHrs}
                </td>
              )
            })}
          </tr>
          <tr className="table-row">
            <td className="font-semibold">Recovered (kWh)</td>
            {peers.map((p) => (
              <td key={p.id} className="font-mono">{formatIndian(p.recoveredKwh)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
