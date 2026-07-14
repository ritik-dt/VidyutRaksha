import type { DetailPanelKey, RevenueSnapshotData } from '../types'
import { duesBucketVariantClass, textToneClass } from '../logic/tone'

interface RevenueSnapshotPanelProps {
  data: RevenueSnapshotData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function RevenueSnapshotPanel({ data, onOpenPanel }: RevenueSnapshotPanelProps) {
  return (
    <section className="exec-panel exec-area-revenue">
      <h3 className="exec-panel-title">
        💰 <em>Revenue</em> Snapshot
      </h3>

      <div className="exec-rev-metrics">
        {data.metrics.map((m) => (
          <div
            key={m.id}
            className="exec-rev-metric"
            onClick={() => onOpenPanel(m.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-rev-metric-name">{m.name}</div>
            <div className="exec-rev-metric-body">
              <div className={`exec-rev-metric-val ${textToneClass(m.tone)}`}>{m.valueText}</div>
              <div className="exec-rev-metric-unit">{m.unit}</div>
            </div>
          </div>
        ))}

        <div
          className="exec-rev-metric exec-rev-metric-outstanding"
          onClick={() => onOpenPanel(data.duesTotal.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="exec-rev-outstanding-head">
            <div className="exec-rev-metric-name">Outstanding Dues</div>
            <div className="exec-rev-metric-body">
              <div className="exec-rev-metric-val">{data.duesTotal.valueText}</div>
              <div className="exec-rev-metric-unit">{data.duesTotal.unit}</div>
            </div>
          </div>

          <div className="exec-dues-buckets">
            {data.duesBuckets.map((b) => (
              <div
                key={b.label}
                className={`exec-dues-bucket ${duesBucketVariantClass(b.variant)}`}
                onClick={(e) => { e.stopPropagation(); onOpenPanel(b.panelKey) }}
                role="button"
                tabIndex={0}
              >
                <div className="exec-dues-bucket-label">{b.label}</div>
                <div className="exec-dues-bucket-bar-bg">
                  <div className="exec-dues-bucket-bar-fill" style={{ width: `${b.percent}%` }} />
                </div>
                <div className="exec-dues-bucket-val">{b.valueText}</div>
              </div>
            ))}
          </div>

          <div
            className="exec-never-paid-alert"
            dangerouslySetInnerHTML={{ __html: data.neverPaidAlert }}
          />
        </div>
      </div>
    </section>
  )
}
