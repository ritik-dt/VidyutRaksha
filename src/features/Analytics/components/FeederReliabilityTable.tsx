import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { SAIDI_DATA } from '../data/reliability'

/**
 * Feeder-wise reliability ranking (screenshot 2-3). Direct port of prototype:
 * - sorted by SAIDI desc
 * - SAIDI color: >18 red, >12 amber, else green
 * - CAIFI color: >15 red, >10 amber, else green
 * - MAIFI color: >30 red, >20 amber, else green
 * - Trend: ↓ = red "Degrading", ↑ = green "Improving", → = text-dim "Stable"
 */
export function FeederReliabilityTable() {
  const sorted = [...SAIDI_DATA].sort((a, b) => b.saidi - a.saidi)

  return (
    <div className="card">
      <div className="card-title">
        Feeder-wise reliability ranking<ChartInfoButton chartId="saidi-trend" />
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>Feeder</th>
              <th>SAIDI (hrs)</th>
              <th>SAIFI</th>
              <th title="Customer Average Interruption Frequency Index — interruptions per affected customer">
                CAIFI
              </th>
              <th title="Momentary Average Interruption Frequency Index — brief outages (< 5 min)">
                MAIFI
              </th>
              <th>CAIDI (hrs)</th>
              <th>ASAI %</th>
              <th>Trend</th>
              <th>Worst DTR</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => {
              const saidiColor = d.saidi > 18 ? 'var(--red)' : d.saidi > 12 ? 'var(--amber)' : 'var(--green)'
              const caifiColor = d.caifi > 15 ? 'var(--red)' : d.caifi > 10 ? 'var(--amber)' : 'var(--green)'
              const maifiColor = d.maifi > 30 ? 'var(--red)' : d.maifi > 20 ? 'var(--amber)' : 'var(--green)'
              const trendColor = d.trend === '↓' ? 'var(--red)' : d.trend === '↑' ? 'var(--green)' : 'var(--text-dim)'
              const trendLabel = d.trend === '↑' ? 'Improving' : d.trend === '↓' ? 'Degrading' : 'Stable'
              return (
                <tr key={d.feeder} className="table-row">
                  <td className="font-semibold" style={{ color: 'var(--id-text, #0284c7)' }}>{d.feeder}</td>
                  <td className="font-mono font-bold" style={{ color: saidiColor }}>{d.saidi}</td>
                  <td className="font-mono">{d.saifi}</td>
                  <td className="font-mono font-semibold" style={{ color: caifiColor }}>{d.caifi}</td>
                  <td className="font-mono font-semibold" style={{ color: maifiColor }}>{d.maifi}</td>
                  <td className="font-mono">{d.caidi}</td>
                  <td className="font-mono">{d.asai}%</td>
                  <td className="text-[14px]" style={{ color: trendColor }}>{d.trend} {trendLabel}</td>
                  <td className="text-[11px] text-text-mid">{d.worst}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
