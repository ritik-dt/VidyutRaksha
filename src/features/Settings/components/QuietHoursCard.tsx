import type { QuietHours } from '../types'

interface QuietHoursCardProps {
  quietHours: QuietHours
  onChange: (q: QuietHours) => void
  blurb: string
  noteHtml: string
}

/** Quiet-hours window. Critical alerts override it. */
export function QuietHoursCard({ quietHours, onChange, blurb, noteHtml }: QuietHoursCardProps) {
  return (
    <div className="card">
      <div className="card-title">Quiet hours</div>
      <div className="set-blurb">{blurb}</div>

      <div className="set-time-row">
        <div className="set-field">
          <div className="set-field-label">From</div>
          <input
            type="time"
            className="form-input set-input"
            value={quietHours.from}
            onChange={(e) => onChange({ ...quietHours, from: e.target.value })}
            aria-label="Quiet hours from"
          />
        </div>
        <div className="set-field">
          <div className="set-field-label">To</div>
          <input
            type="time"
            className="form-input set-input"
            value={quietHours.to}
            onChange={(e) => onChange({ ...quietHours, to: e.target.value })}
            aria-label="Quiet hours to"
          />
        </div>
      </div>

      <div className="set-note" dangerouslySetInnerHTML={{ __html: noteHtml }} />
    </div>
  )
}
