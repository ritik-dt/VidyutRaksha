import { BEFORE_AFTER } from '../data/photos'

/** Right card in the grid-2 pair — before/after evidence comparison. */
export function BeforeAfterCard() {
  return (
    <div className="card">
      <div className="card-title">Before / after photo comparison</div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {/* BEFORE */}
        <div>
          <div
            className="flex items-center justify-center text-[42px] text-white"
            style={{
              aspectRatio: '1',
              background: 'linear-gradient(135deg,#DC3545,#8B2332)',
              borderRadius: 6,
            }}
          >
            📷
          </div>
          <div className="mt-1.5 text-center text-[11px] font-semibold" style={{ color: 'var(--red)' }}>
            BEFORE SEAL
          </div>
          <div className="text-center text-[10px] text-text-dim">{BEFORE_AFTER.beforeDate}</div>
        </div>

        {/* AFTER */}
        <div>
          <div
            className="flex items-center justify-center text-[42px] text-white"
            style={{
              aspectRatio: '1',
              background: 'linear-gradient(135deg,#28A745,#1E6F30)',
              borderRadius: 6,
            }}
          >
            📷
          </div>
          <div className="mt-1.5 text-center text-[11px] font-semibold" style={{ color: 'var(--green)' }}>
            AFTER SEAL
          </div>
          <div className="text-center text-[10px] text-text-dim">{BEFORE_AFTER.afterDate}</div>
        </div>
      </div>

      <div
        className="mt-3 rounded-md text-[11px] leading-[1.5] text-ai-purple"
        style={{ padding: 10, background: 'var(--ai-purple-light)' }}
        dangerouslySetInnerHTML={{ __html: BEFORE_AFTER.comparisonHtml }}
      />
    </div>
  )
}
