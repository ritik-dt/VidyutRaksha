import type { ReportsAiInsightData } from '../types'

interface ReportsAiInsightProps {
  insight: ReportsAiInsightData
  onOpenCea: () => void
  onGoExecutive: () => void
}

/**
 * AI report-assistant footer. Uses the app's shared .ai-insight styling
 * (which is fully responsive already), with buttons that wrap on mobile.
 */
export function ReportsAiInsight({ insight, onOpenCea, onGoExecutive }: ReportsAiInsightProps) {
  return (
    <div className="ai-insight mb-[14px]">
      <div className="ai-insight-header">{insight.title}</div>
      <div
        className="ai-insight-body [&_strong]:text-[var(--ai-purple)] [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: insight.bodyHtml }}
      />
      <div className="flex gap-[6px] mt-[10px] flex-wrap max-[480px]:gap-[8px]">
        <button
          type="button"
          className="btn btn-ai btn-sm !py-[5px] !px-[11px] !text-[10.5px] max-[480px]:flex-1 max-[480px]:min-w-0"
          onClick={onOpenCea}
        >
          ✦ Open CEA report
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm !py-[5px] !px-[11px] !text-[10.5px] max-[480px]:flex-1 max-[480px]:min-w-0"
          onClick={onGoExecutive}
        >
          Go to Executive →
        </button>
      </div>
    </div>
  )
}
