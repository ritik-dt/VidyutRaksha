import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { formatIndian } from '@/shared/utils/formatters'
import { loadingColor, lossColor } from '../data/audit'
import { DT_DATA } from '../data/dtData'

/**
 * DT-level detailed audit table — 11 columns × 8 DT rows (screenshot 5-6).
 * Matches prototype's DT-level table with loading bars, phase indicators,
 * and alert counters.
 */
export function DtLevelAuditTable() {
  return (
    <div className="card">
      <div className="card-title">
        DT-level detailed audit
        <ChartInfoButton chartId="dt-loss-top10" />
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>DT</th>
              <th>Div</th>
              <th>Feeder</th>
              <th>Cap</th>
              <th>Loading</th>
              <th>Meters</th>
              <th>Input</th>
              <th>Billed</th>
              <th>Loss</th>
              <th>Loss %</th>
              <th>R/Y/B</th>
              <th>Alerts</th>
            </tr>
          </thead>
          <tbody>
            {DT_DATA.map((d) => {
              const loss = d.input - d.billed
              const phaseSpread = Math.max(d.phaseR, d.phaseY, d.phaseB) - Math.min(d.phaseR, d.phaseY, d.phaseB)
              const alertColor = d.alerts > 2 ? 'var(--red)' : d.alerts > 0 ? 'var(--amber)' : 'var(--text-dim)'
              return (
                <tr key={d.dt} className="table-row">
                  <td className="font-mono font-bold" style={{ color: 'var(--id-text, #0284c7)' }}>{d.dt}</td>
                  <td className="text-[11px]">{d.div}</td>
                  <td className="text-[11px]">{d.feeder}</td>
                  <td className="text-[11px]">{d.cap}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-14 flex-shrink-0 overflow-hidden rounded"
                        style={{ background: 'var(--border)' }}
                      >
                        <div
                          className="h-full rounded"
                          style={{ width: `${d.load}%`, background: loadingColor(d.load) }}
                        />
                      </div>
                      <span className="font-mono text-[11px]">{d.load}%</span>
                    </div>
                  </td>
                  <td className="font-mono text-[11px]">{d.meters}</td>
                  <td className="font-mono text-[11px]">{formatIndian(d.input)}</td>
                  <td className="font-mono text-[11px]">{formatIndian(d.billed)}</td>
                  <td className="font-mono text-[11px]" style={{ color: 'var(--red)' }}>{formatIndian(loss)}</td>
                  <td className="font-bold" style={{ color: lossColor(d.loss) }}>{d.loss}%</td>
                  <td className="font-mono text-[10px]">
                    {d.phaseR}/{d.phaseY}/{d.phaseB}
                    {phaseSpread > 10 && <span style={{ color: 'var(--red)' }}> ⚠</span>}
                  </td>
                  <td
                    className="text-center font-mono"
                    style={{ color: alertColor, fontWeight: d.alerts ? 700 : 400 }}
                  >
                    {d.alerts}
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
