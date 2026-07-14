import type { Recommendation } from '../types'

interface RecommendationCardProps {
  recommendation: Recommendation
  onLockScope: () => void
  onSendBoard: () => void
}

/** Recommendation to CMD & Board card + the two footer action buttons. */
export function RecommendationCard({
  recommendation,
  onLockScope,
  onSendBoard,
}: RecommendationCardProps) {
  return (
    <>
      <div className="card roi-reco">
        <div className="roi-reco-head">
          <span className="roi-reco-spark">✦</span>
          <div className="roi-reco-title">Recommendation to CMD &amp; Board</div>
        </div>
        <div className="roi-reco-body">
          <span dangerouslySetInnerHTML={{ __html: recommendation.approveHtml }} />
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: recommendation.bottomLineHtml }} />
        </div>
      </div>

      <div className="roi-footer-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onLockScope}>
          📋 Lock pilot scope
        </button>
        <button type="button" className="btn btn-ai btn-sm" onClick={onSendBoard}>
          ✦ Send to board
        </button>
      </div>
    </>
  )
}
