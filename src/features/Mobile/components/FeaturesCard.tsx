import { MOBILE_FEATURES } from '../data/mobile'

/** "Mobile app features" card — 8 items from the prototype. */
export function FeaturesCard() {
  return (
    <div className="card mb-3">
      <div className="card-title">Mobile app features</div>
      <div className="mt-2">
        {MOBILE_FEATURES.map((f, i) => (
          <div
            key={f.name}
            className="flex items-start gap-2.5 p-2.5"
            style={{
              borderBottom: i < MOBILE_FEATURES.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <div className="shrink-0 text-[22px]">{f.icon}</div>
            <div className="flex-1">
              <div className="mb-0.5 text-[12px] font-bold" style={{ color: f.color }}>
                {f.name}
              </div>
              <div className="text-[11px] leading-[1.4] text-text-mid">{f.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
