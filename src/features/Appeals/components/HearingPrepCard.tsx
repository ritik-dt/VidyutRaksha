import {
  FEATURED_APPEAL_CONSUMER,
  FEATURED_APPEAL_ID,
  HEARING_PREP_BOXES,
} from '../data/appeals'

interface HearingPrepCardProps {
  onExportBrief: () => void
  onPrepareCase: () => void
}

/** AI hearing preparation card — port of the prototype's featured-hearing block. */
export function HearingPrepCard({ onExportBrief, onPrepareCase }: HearingPrepCardProps) {
  return (
    <div className="card mt-3.5">
      <div className="card-title text-ai-purple">
        ✦ AI hearing preparation — {FEATURED_APPEAL_ID} ({FEATURED_APPEAL_CONSUMER})
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {HEARING_PREP_BOXES.map((box) => (
          <div
            key={box.title}
            className="rounded-md p-3"
            style={{
              background: 'var(--bg)',
              borderTop: `3px solid ${box.color}`,
            }}
          >
            <div className="mb-1.5 text-[12px] font-bold" style={{ color: box.color }}>
              {box.title}
            </div>
            <div
              className="text-[11px] leading-[1.5] text-text-mid"
              dangerouslySetInnerHTML={{ __html: box.bodyHtml }}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-1.5 max-sm:justify-stretch">
        <button
          type="button"
          className="btn btn-outline btn-sm max-sm:flex-1"
          onClick={onExportBrief}
        >
          📄 Export hearing brief
        </button>
        <button
          type="button"
          className="btn btn-ai btn-sm max-sm:w-full"
          onClick={onPrepareCase}
        >
          ✦ Prepare full case for hearing
        </button>
      </div>
    </div>
  )
}
