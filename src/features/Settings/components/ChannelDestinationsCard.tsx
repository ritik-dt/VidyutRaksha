import type { Destinations } from '../types'

interface ChannelDestinationsCardProps {
  destinations: Destinations
  onChange: (key: 'phone' | 'email', value: string) => void
}

/** Where each channel delivers. Phone + email are derived from the active role. */
export function ChannelDestinationsCard({
  destinations,
  onChange,
}: ChannelDestinationsCardProps) {
  return (
    <div className="card">
      <div className="card-title">Channel destinations</div>

      <div className="set-dest-list">
        <div>
          <div className="set-field-label">📱 Mobile (SMS)</div>
          <input
            className="form-input set-input"
            value={destinations.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            aria-label="Mobile number"
          />
        </div>

        <div>
          <div className="set-field-label">✉️ Email</div>
          <input
            className="form-input set-input"
            value={destinations.email}
            onChange={(e) => onChange('email', e.target.value)}
            aria-label="Email address"
          />
        </div>

        <div>
          <div className="set-field-label">📲 Push device</div>
          <div className="set-push-device">
            {destinations.pushDevice} <span className="set-push-dot">●</span>
          </div>
        </div>
      </div>
    </div>
  )
}
