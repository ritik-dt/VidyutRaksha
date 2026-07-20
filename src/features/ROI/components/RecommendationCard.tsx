import type { Recommendation } from '../types'

interface RecommendationCardProps {
  recommendation: Recommendation
  onLockScope: () => void
  onSendBoard: () => void
}

/**
 * Recommendation to CMD & Board card + the two footer action buttons.
 *   • Card: purple-to-green gradient background with 2px purple border,
 *     sparkle icon + uppercase purple title, body with inline strong.
 *   • Footer: right-aligned buttons (Lock pilot scope + Send to board).
 *     Mobile: buttons stretch flex-1 for full-width tap targets.
 */
export function RecommendationCard({
  recommendation,
  onLockScope,
  onSendBoard,
}: RecommendationCardProps) {
  return (
    <>
      <div
        className="card !m-0 mb-[14px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(40,167,69,0.04) 100%)',
          border: '2px solid rgba(124,58,237,0.4)',
        }}
      >
        <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
          <span className="text-[18px]">✦</span>
          <div className="text-[13px] font-extrabold text-[var(--ai-purple)] uppercase tracking-[0.5px] break-words max-[480px]:text-[12px]">
            Recommendation to CMD &amp; Board
          </div>
        </div>
        <div className="text-[11.5px] text-[var(--text)] leading-[1.6] [&_strong]:font-bold break-words max-[480px]:text-[11px]">
          <span dangerouslySetInnerHTML={{ __html: recommendation.approveHtml }} />
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: recommendation.bottomLineHtml }} />
        </div>
      </div>

      <div className="flex justify-end gap-[6px] flex-wrap max-[480px]:justify-stretch">
        <button
          type="button"
          className="btn btn-outline btn-sm max-[480px]:flex-1 max-[480px]:min-w-0"
          onClick={onLockScope}
        >
          📋 Lock pilot scope
        </button>
        <button
          type="button"
          className="btn btn-ai btn-sm max-[480px]:flex-1 max-[480px]:min-w-0"
          onClick={onSendBoard}
        >
          ✦ Send to board
        </button>
      </div>
    </>
  )
}
