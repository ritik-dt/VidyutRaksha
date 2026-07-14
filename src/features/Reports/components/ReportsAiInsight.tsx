import type { ReportsAiInsightData } from '../types'

interface ReportsAiInsightProps {
  insight: ReportsAiInsightData
  onOpenCea: () => void
  onGoExecutive: () => void
}

/** AI report-assistant footer. Uses the app's existing .ai-insight styling. */
export function ReportsAiInsight({ insight, onOpenCea, onGoExecutive }: ReportsAiInsightProps) {
  return (
    <div className="ai-insight" style={{ marginBottom: 14 }}>
      <div className="ai-insight-header">{insight.title}</div>
      <div
        className="ai-insight-body"
        dangerouslySetInnerHTML={{ __html: insight.bodyHtml }}
      />
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ai btn-sm" onClick={onOpenCea}>
          ✦ Open CEA report
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onGoExecutive}>
          Go to Executive →
        </button>
      </div>
    </div>
  )
}
