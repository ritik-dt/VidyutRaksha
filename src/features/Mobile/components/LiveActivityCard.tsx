import { FIELD_ACTIVITY } from '../data/mobile'

/** "Today's field activity (live)" card — 5 inspector activity entries. */
export function LiveActivityCard() {
  return (
    <div className="card">
      <div className="card-title">Today's field activity (live)</div>
      <div className="flex flex-col gap-2">
        {FIELD_ACTIVITY.map((a, i) => (
          <div
            key={a.who}
            className="flex items-center gap-2.5 py-1.5"
            style={{
              borderBottom: i < FIELD_ACTIVITY.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <div
              className="size-2 shrink-0 rounded-full"
              style={{ background: a.dotColor }}
              aria-hidden
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-text">{a.who}</div>
              <div className="text-[10px] text-text-mid">{a.what}</div>
            </div>
            <div className="shrink-0 font-mono text-[10px] text-text-dim">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
