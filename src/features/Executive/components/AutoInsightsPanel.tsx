import type { DetailPanelKey, Insight } from '../types'

interface AutoInsightsPanelProps {
  insights: Insight[]
  onOpenPanel: (key: DetailPanelKey) => void
}

export function AutoInsightsPanel({ insights, onOpenPanel }: AutoInsightsPanelProps) {
  return (
    <section className="exec-panel exec-area-insights">
      <h3 className="exec-panel-title">
        🤖 Auto <em>Insights</em>
      </h3>
      <div className="exec-insights-list">
        {insights.map((i) => (
          <div
            key={i.id}
            className="exec-insight-item"
            onClick={() => onOpenPanel(i.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-insight-icon">{i.icon}</div>
            <div className="exec-insight-body">
              <div className={`exec-insight-tag exec-insight-tag-${i.tagVariant}`}>{i.tag}</div>
              <div
                className="exec-insight-text"
                dangerouslySetInnerHTML={{ __html: i.bodyHtml }}
              />
              <div className="exec-insight-time">{i.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
