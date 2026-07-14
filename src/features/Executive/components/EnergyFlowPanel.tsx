import type { DetailPanelKey, EnergyFlowData } from '../types'

interface EnergyFlowPanelProps {
  data: EnergyFlowData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function EnergyFlowPanel({ data, onOpenPanel }: EnergyFlowPanelProps) {
  return (
    <section className="exec-panel exec-area-energy">
      <h3 className="exec-panel-title">
        ⚡ Energy <em>Flow</em>
        <span className="exec-panel-ptag">FUNNEL</span>
      </h3>

      <div className="exec-funnel">
        <div className="exec-funnel-row" onClick={() => onOpenPanel(data.input.panelKey)} role="button" tabIndex={0}>
          <div className="exec-funnel-label">Input Energy</div>
          <div className="exec-funnel-bar-wrap">
            <div className="exec-funnel-bar exec-funnel-bar-input">{data.input.valueText}</div>
          </div>
        </div>
        <div className="exec-funnel-arrow">↓</div>

        <div className="exec-funnel-row" onClick={() => onOpenPanel(data.billed.panelKey)} role="button" tabIndex={0}>
          <div className="exec-funnel-label">Billed Energy</div>
          <div className="exec-funnel-bar-wrap">
            <div className="exec-billed-split">
              <div className="exec-billed-cum">
                Total: <strong>{data.billed.totalText.replace('Total: ', '')}</strong>
              </div>
              <div className="exec-billed-sub-row">
                <div className="exec-billed-seg exec-billed-seg-ok" style={{ flex: data.billed.okSegment.flex }}>
                  {data.billed.okSegment.valueText}
                  <span className="exec-billed-seg-tag">{data.billed.okSegment.tag}</span>
                </div>
                <div className="exec-billed-seg exec-billed-seg-prov" style={{ flex: data.billed.provSegment.flex }}>
                  {data.billed.provSegment.valueText}
                  <span className="exec-billed-seg-tag">{data.billed.provSegment.tag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="exec-funnel-arrow">↓</div>

        <div className="exec-funnel-row" onClick={() => onOpenPanel(data.collected.panelKey)} role="button" tabIndex={0}>
          <div className="exec-funnel-label">Collected</div>
          <div className="exec-funnel-bar-wrap">
            <div className="exec-funnel-bar exec-funnel-bar-collected">{data.collected.valueText}</div>
          </div>
        </div>
      </div>

      <div className="exec-loss-badge" onClick={() => onOpenPanel(data.lossGap.panelKey)} role="button" tabIndex={0}>
        <div className="exec-loss-badge-val">{data.lossGap.valueText}</div>
        <div className="exec-loss-badge-text">
          Total Loss Gap<br />
          <strong>{data.lossGap.percentText}</strong> {data.lossGap.monetaryText}
        </div>
      </div>
    </section>
  )
}
