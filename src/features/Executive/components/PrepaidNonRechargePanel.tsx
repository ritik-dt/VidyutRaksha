import type { DetailPanelKey, PrepaidNonRechargeData } from '../types'

interface PrepaidNonRechargePanelProps {
  data: PrepaidNonRechargeData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function PrepaidNonRechargePanel({ data, onOpenPanel }: PrepaidNonRechargePanelProps) {
  return (
    <section className="exec-panel exec-area-prepaid">
      <h3 className="exec-panel-title">
        💳 Prepaid <em>Non-Recharge</em> Watch
        <span className="exec-panel-ptag">RISK</span>
      </h3>

      <div className="exec-prepaid-head">
        <div>
          <div className="exec-prepaid-total">{data.totalText}</div>
          <div className="exec-prepaid-sub">{data.subtitle}</div>
        </div>
        <div className="exec-prepaid-trend">
          <div className="exec-prepaid-trend-pct">{data.trendPct}</div>
          <div className="exec-prepaid-trend-vs">{data.vsText}</div>
        </div>
      </div>

      <table className="exec-prepaid-table">
        <thead>
          <tr>
            <th>Bucket</th>
            <th>Consumers</th>
            <th className="exec-prepaid-th-share">Share</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.buckets.map((b) => (
            <tr
              key={b.label}
              className={[
                b.isEmphasis ? 'exec-prepaid-emphasis' : '',
                b.isSubtle ? 'exec-prepaid-subtle' : '',
              ].filter(Boolean).join(' ')}
            >
              <td>{b.label}</td>
              <td className="exec-prepaid-cnt">{b.consumersText}</td>
              <td>
                <div className="exec-prepaid-bar">
                  <div className="exec-prepaid-bar-fill" style={{ width: `${b.sharePercent}%` }} />
                </div>
                <div className="exec-prepaid-pct">{b.sharePercent}%</div>
              </td>
              <td>
                <span className={`exec-prepaid-trend-cell exec-trend-${b.trend}`}>{b.trendText}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="exec-prepaid-alert"
        onClick={() => onOpenPanel(data.alertPanelKey)}
        role="button"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: data.alertText }}
      />
    </section>
  )
}
