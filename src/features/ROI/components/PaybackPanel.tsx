import type { CumulativeNetComputed } from '../logic/cumulativeNet'
import type { PaybackStat } from '../types'

interface PaybackPanelProps {
  stats: PaybackStat[]
  cumulativeNet: CumulativeNetComputed[]
}

/** Payback & NPV panel: 4 stat tiles + 5-year cumulative-net bars. */
export function PaybackPanel({ stats, cumulativeNet }: PaybackPanelProps) {
  return (
    <div className="card">
      <div className="card-title">Payback &amp; NPV (base case)</div>
      <div className="roi-payback-grid">
        {stats.map((s) => (
          <div key={s.id} className={`roi-payback-tile roi-tone-${s.tone}`}>
            <div className="roi-payback-label">{s.label}</div>
            <div className="roi-payback-value">{s.value}</div>
            <div className="roi-payback-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="roi-cumnet">
        <div className="roi-cumnet-label">5-year cumulative net (₹ Cr)</div>
        {cumulativeNet.map((r) => (
          <div key={r.year} className="roi-cumnet-row">
            <div className="roi-cumnet-year">{r.year}</div>
            <div className="roi-cumnet-track">
              <div className="roi-cumnet-fill" style={{ width: `${r.widthPct}%` }} />
            </div>
            <div className="roi-cumnet-val">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
