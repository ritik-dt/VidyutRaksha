import type { QuietHours } from '../types'

interface QuietHoursCardProps {
  quietHours: QuietHours
  onChange: (q: QuietHours) => void
  blurb: string
  noteHtml: string
}

/** Quiet-hours window. Critical alerts override it.
 *  Time row stacks to column at ≤640px. */
export function QuietHoursCard({ quietHours, onChange, blurb, noteHtml }: QuietHoursCardProps) {
  return (
    <div className="card">
      <div className="card-title">Quiet hours</div>
      <div className="text-[11.5px] text-[var(--text-mid)] leading-[1.5] mb-3">{blurb}</div>

      <div className="flex gap-[10px] items-center max-[640px]:flex-col max-[640px]:items-stretch">
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[var(--text-dim)] mb-[3px] uppercase tracking-[0.5px]">
            From
          </div>
          <input
            type="time"
            className="form-input !text-[12px] !py-[7px] !px-[10px]"
            value={quietHours.from}
            onChange={(e) => onChange({ ...quietHours, from: e.target.value })}
            aria-label="Quiet hours from"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] text-[var(--text-dim)] mb-[3px] uppercase tracking-[0.5px]">
            To
          </div>
          <input
            type="time"
            className="form-input !text-[12px] !py-[7px] !px-[10px]"
            value={quietHours.to}
            onChange={(e) => onChange({ ...quietHours, to: e.target.value })}
            aria-label="Quiet hours to"
          />
        </div>
      </div>

      <div
        className="mt-[14px] p-[10px] bg-[var(--bg)] rounded-md text-[11px] text-[var(--text-mid)] leading-[1.5]"
        dangerouslySetInnerHTML={{ __html: noteHtml }}
      />
    </div>
  )
}
