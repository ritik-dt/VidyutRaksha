import type { NotifCategoryId, NotifFreq, NotifPref } from '@/shared/types/notif'
import { notifStatus } from '../logic/settingsLogic'
import type { AlertCategory, Channel, FreqOption } from '../types'

interface NotifPrefsTableProps {
  categories: AlertCategory[]
  channels: Channel[]
  freqOptions: FreqOption[]
  pref: (category: NotifCategoryId) => NotifPref
  onToggle: (category: NotifCategoryId, channel: keyof NotifPref, value: boolean) => void
  onFreq: (category: NotifCategoryId, freq: NotifFreq) => void
}

const STATUS_CLASS = {
  OFF: 'set-status-off',
  LIVE: 'set-status-live',
  DIGEST: 'set-status-digest',
} as const

/** 5 categories × 3 channel checkboxes + delivery select + computed status. */
export function NotifPrefsTable({
  categories,
  channels,
  freqOptions,
  pref,
  onToggle,
  onFreq,
}: NotifPrefsTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">Notification preferences</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th style={{ width: '30%' }}>Alert category</th>
              {channels.map((c) => (
                <th key={c.id} style={{ width: '13%', textAlign: 'center' }}>
                  {c.icon} {c.label}
                </th>
              ))}
              <th style={{ width: '18%' }}>Delivery</th>
              <th style={{ width: '13%', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const p = pref(cat.id)
              const status = notifStatus(p)
              return (
                <tr key={cat.id} className="table-row">
                  <td>
                    <div className="set-cat-cell">
                      <span className="set-cat-icon">{cat.icon}</span>
                      <div>
                        <div className="set-cat-label">{cat.label}</div>
                        <div className="set-cat-desc">{cat.desc}</div>
                      </div>
                    </div>
                  </td>

                  {channels.map((ch) => (
                    <td key={ch.id} className="set-check-cell">
                      <label className="set-check-label">
                        <input
                          type="checkbox"
                          className="set-check"
                          checked={p[ch.id]}
                          onChange={(e) => onToggle(cat.id, ch.id, e.target.checked)}
                          aria-label={`${cat.label} — ${ch.label}`}
                        />
                      </label>
                    </td>
                  ))}

                  <td>
                    <select
                      className="set-freq-select"
                      value={p.freq}
                      onChange={(e) => onFreq(cat.id, e.target.value as NotifFreq)}
                      aria-label={`${cat.label} — delivery`}
                    >
                      {freqOptions.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="set-status-cell">
                    <span className={`set-status ${STATUS_CLASS[status]}`}>{status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
