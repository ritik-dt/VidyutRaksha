import type { Destinations } from '../types'

interface ChannelDestinationsCardProps {
  destinations: Destinations
  onChange: (key: 'phone' | 'email', value: string) => void
}

/** Where each channel delivers. Phone + email are derived from the active role.
 *  Matches prototype: flex-col with 10px gap, uppercase field labels. */
export function ChannelDestinationsCard({
  destinations,
  onChange,
}: ChannelDestinationsCardProps) {
  return (
    <div className="card">
      <div className="card-title">Channel destinations</div>

      <div className="flex flex-col gap-[10px]">
        <div>
          <div className="text-[10.5px] text-[var(--text-dim)] mb-[3px] uppercase tracking-[0.5px]">
            📱 Mobile (SMS)
          </div>
          <input
            className="form-input !text-[12px] !py-[7px] !px-[10px]"
            value={destinations.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            aria-label="Mobile number"
          />
        </div>

        <div>
          <div className="text-[10.5px] text-[var(--text-dim)] mb-[3px] uppercase tracking-[0.5px]">
            ✉️ Email
          </div>
          <input
            className="form-input !text-[12px] !py-[7px] !px-[10px]"
            value={destinations.email}
            onChange={(e) => onChange('email', e.target.value)}
            aria-label="Email address"
          />
        </div>

        <div>
          <div className="text-[10.5px] text-[var(--text-dim)] mb-[3px] uppercase tracking-[0.5px]">
            📲 Push device
          </div>
          <div className="py-2 px-[10px] bg-[var(--bg)] rounded-md text-[11px] text-[var(--text)]">
            {destinations.pushDevice}{' '}
            <span className="text-[var(--green)] font-bold">●</span>
          </div>
        </div>
      </div>
    </div>
  )
}
