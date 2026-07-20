/**
 * Legend row shown below the map — 7 asset types with colored dots.
 *
 * Replaces prototype's `.map-legend-box/.map-legend-item/.map-legend-dot`
 * triad with inline Tailwind classes. Legend collapses gap + font-size at
 * ≤640px (was `@media (max-width:640px) .map-legend-box { gap:8px; padding:8px 10px; font-size:9.5px }`).
 */
export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-[12px] mt-[10px] py-[8px] px-[12px] bg-[var(--bg)] rounded-[8px] text-[10px] text-[var(--text-dim)] max-[640px]:gap-[8px] max-[640px]:!py-[8px] max-[640px]:!px-[10px] max-[640px]:text-[9.5px]">
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[8px] h-[8px] rounded-full"
          style={{ background: '#0F2B46' }}
        />
        Feeder
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[8px] h-[8px] rounded-full"
          style={{ background: 'var(--green)' }}
        />
        DTR (low loss)
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[8px] h-[8px] rounded-full"
          style={{ background: 'var(--amber)' }}
        />
        DTR (mid loss)
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[8px] h-[8px] rounded-full"
          style={{ background: 'var(--red)' }}
        />
        DTR (high loss)
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[6px] h-[6px] rounded-full"
          style={{ background: 'var(--green)' }}
        />
        Consumer (safe)
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[6px] h-[6px] rounded-full"
          style={{ background: 'var(--red)' }}
        />
        Consumer (suspicious)
      </div>
      <div className="flex items-center gap-[4px]">
        <div
          className="w-[8px] h-[8px] rounded-full box-border"
          style={{
            background: 'var(--red)',
            border: '2px solid #D4A017',
          }}
        />
        ✓ Real KVVNL meter
      </div>
    </div>
  )
}
