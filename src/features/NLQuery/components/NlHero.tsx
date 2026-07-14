/**
 * Centered hero for the NLQuery screen. Port of the prototype's top block:
 * a 56×56 rounded gradient square containing the sparkle SVG, above the
 * page title and sub-title. Static content — no interactions.
 */
export function NlHero() {
  return (
    <div className="mb-6 text-center">
      <div
        className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl"
        style={{ background: 'var(--ai-gradient)', boxShadow: 'var(--ai-glow)' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
      <div className="page-title text-[20px] font-bold text-text">Ask your data anything</div>
      <div className="page-sub mt-[3px] text-[12px] text-text-dim">
        Type in plain English or Hindi — the AI translates to queries and returns results instantly.
      </div>
    </div>
  )
}
