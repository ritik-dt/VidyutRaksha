import type { DetailPanelKey, ReliabilityPanelData } from '../types'
import { reliabilityToneClass } from '../logic/tone'

interface ReliabilityPanelProps {
  data: ReliabilityPanelData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function ReliabilityPanel({ data, onOpenPanel }: ReliabilityPanelProps) {
  const tf = data.transformerFailures
  return (
    <section className="exec-panel exec-area-reliability">
      <h3 className="exec-panel-title">
        📡 <em>Reliability</em> Indices
      </h3>

      <div className="exec-rel-metrics">
        {data.metrics.map((m) => (
          <div
            key={m.id}
            className={`exec-rel-metric ${reliabilityToneClass(m.tone)}`}
            onClick={() => onOpenPanel(m.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="exec-rel-metric-name">{m.name}</div>
              <div className="exec-rel-metric-unit">{m.subtitle}</div>
            </div>
            <div className="exec-rel-metric-val-wrap">
              <div className="exec-rel-metric-val">{m.valueText}</div>
              <div className="exec-rel-metric-unit">{m.unit}</div>
            </div>
          </div>
        ))}

        <div className="exec-tf-block" onClick={() => onOpenPanel(tf.panelKey)} role="button" tabIndex={0}>
          <div className="exec-tf-head">
            <div>
              <div className="exec-rel-metric-name">Transformer Failures</div>
              <div className="exec-rel-metric-unit">FYTD · Failures / Fleet</div>
            </div>
            <div className="exec-tf-cum-wrap">
              <div className="exec-tf-cum">
                <strong>{tf.totalText}</strong> <span>{tf.fleetText}</span>{' '}
                <span className="exec-tf-pct">{tf.percentText}</span>
              </div>
              <div className="exec-rel-metric-unit">affected transformers</div>
            </div>
          </div>
          <div className="exec-tf-split">
            <div className="exec-tf-split-row exec-tf-below">
              <div className="exec-tf-split-label">{tf.belowKva.label}</div>
              <div className="exec-tf-split-track">
                <div className="exec-tf-split-fill" style={{ width: `${tf.belowKva.barPercent}%` }} />
              </div>
              <div className="exec-tf-split-val">{tf.belowKva.valueText}</div>
            </div>
            <div className="exec-tf-split-row exec-tf-above">
              <div className="exec-tf-split-label">{tf.aboveKva.label}</div>
              <div className="exec-tf-split-track">
                <div className="exec-tf-split-fill" style={{ width: `${tf.aboveKva.barPercent}%` }} />
              </div>
              <div className="exec-tf-split-val">{tf.aboveKva.valueText}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
