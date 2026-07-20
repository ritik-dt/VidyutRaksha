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

/** Status-pill styling per computed status. Values match prototype's inline styles. */
const STATUS_STYLE: Record<
  'OFF' | 'LIVE' | 'DIGEST',
  { bg: string; color: string }
> = {
  OFF: { bg: 'var(--bg)', color: 'var(--text-dim)' },
  LIVE: { bg: 'rgba(40,167,69,.12)', color: 'var(--green)' },
  DIGEST: { bg: 'rgba(23,162,184,.12)', color: 'var(--teal)' },
}

/** 5 categories × 3 channel checkboxes + delivery select + computed status.
 *  Matches prototype's renderSettings() notification table exactly. */
export function NotifPrefsTable({
  categories,
  channels,
  freqOptions,
  pref,
  onToggle,
  onFreq,
}: NotifPrefsTableProps) {
  return (
    <div className="card mb-[14px]">
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
              const s = STATUS_STYLE[status]
              return (
                <tr key={cat.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-[10px]">
                      <span className="text-[18px] shrink-0">{cat.icon}</span>
                      <div>
                        <div className="font-bold text-[12.5px]">{cat.label}</div>
                        <div className="text-[10.5px] text-[var(--text-dim)] mt-[1px]">
                          {cat.desc}
                        </div>
                      </div>
                    </div>
                  </td>

                  {channels.map((ch) => (
                    <td key={ch.id} className="text-center">
                      <label className="inline-flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          className="w-[18px] h-[18px] cursor-pointer accent-[var(--ai-purple)]"
                          checked={p[ch.id]}
                          onChange={(e) => onToggle(cat.id, ch.id, e.target.checked)}
                          aria-label={`${cat.label} — ${ch.label}`}
                        />
                      </label>
                    </td>
                  ))}

                  <td>
                    <select
                      className="py-[5px] px-2 border border-[var(--border)] rounded-[5px] text-[11px] bg-[var(--card)] font-[inherit] w-full text-[var(--text)]"
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

                  <td className="text-center">
                    <span
                      className="inline-block py-[2px] px-2 rounded-[10px] text-[9.5px] font-bold"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {status}
                    </span>
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
