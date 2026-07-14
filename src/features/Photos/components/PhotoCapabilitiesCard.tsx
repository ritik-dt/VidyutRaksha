import { PHOTO_CAPABILITIES } from '../data/photos'

/** Left card in the grid-2 pair — AI photo capabilities list. */
export function PhotoCapabilitiesCard() {
  return (
    <div className="card">
      <div className="card-title text-ai-purple">✦ AI photo capabilities</div>
      <div className="mt-3 flex flex-col gap-2.5">
        {PHOTO_CAPABILITIES.map((f) => (
          <div
            key={f.name}
            className="flex gap-2.5 border-b border-border-light p-2 last:border-b-0"
          >
            <div className="text-[20px]">{f.icon}</div>
            <div className="flex-1">
              <div className="text-[12px] font-bold text-ai-purple">{f.name}</div>
              <div className="text-[11px] text-text-mid">{f.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
