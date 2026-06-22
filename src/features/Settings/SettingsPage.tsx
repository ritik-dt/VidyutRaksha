import { useState, type ChangeEvent } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useRole } from '@/shared/context/RoleContext'
import { useToast } from '@/shared/context/ToastContext'

type Freq = 'realtime' | 'digest' | 'off'
type Channel = 'inApp' | 'email' | 'sms'

interface NotifPref {
  catId: string
  inApp: Freq
  email: Freq
  sms: Freq
}

const CATEGORIES = [
  { id: 'high-risk', label: 'High-risk meter detected', icon: '⚠️', desc: 'New meter crosses risk score 80' },
  { id: 'sla-breach', label: 'Case SLA breach', icon: '⏰', desc: 'Case approaches or exceeds SLA' },
  { id: 'overload', label: 'DT overload', icon: '⚡', desc: 'DT loading exceeds 85%' },
  { id: 'approval', label: 'Approval pending', icon: '📋', desc: 'Assessment awaits your approval' },
  { id: 'kpi-alert', label: 'KPI threshold breach', icon: '📊', desc: 'Loss/hit-rate crosses target' },
]

const FREQ_OPTS: { value: Freq; label: string }[] = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'digest', label: 'Daily digest' },
  { value: 'off', label: 'Off' },
]

const FREQ_COLOR: Record<Freq, string> = {
  realtime: 'var(--green)',
  digest: 'var(--amber)',
  off: 'var(--text-dim)',
}

function makeDefaults(): NotifPref[] {
  return CATEGORIES.map((c) => ({
    catId: c.id,
    inApp: 'realtime' as Freq,
    email: c.id === 'high-risk' || c.id === 'sla-breach' ? 'realtime' : 'digest',
    sms: c.id === 'sla-breach' ? 'realtime' : 'off',
  }))
}

export default function SettingsPage() {
  const { currentRole: role } = useRole()
  const { showToast } = useToast()
  const [prefs, setPrefs] = useState<NotifPref[]>(makeDefaults)

  function setFreq(catId: string, channel: Channel, val: Freq) {
    setPrefs((prev: NotifPref[]) => prev.map((p: NotifPref) => p.catId === catId ? { ...p, [channel]: val } : p))
  }

  return (
    <div className="pb-8">
      <PageHeader
        title="⚙️ Settings"
        subtitle={`Notification preferences for ${role?.label ?? 'your role'} · changes apply to your role only`}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setPrefs(makeDefaults())}>
              ↻ Reset to defaults
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Preferences saved', message: 'Notification settings updated.', duration: 3000 })}>
              💾 Save preferences
            </button>
          </>
        }
      />

      <AiInsightBanner title={`Smart defaults for ${role?.label ?? 'your role'}`}>
        Based on your role, I have pre-configured notifications to match your typical workflow.
        Real-time in-app + email for high-risk detections. Daily digest for KPI alerts.
        SMS only for SLA breach to keep mobile notifications actionable.
        You can override any setting below.
      </AiInsightBanner>

      {/* Notification matrix */}
      <div className="card mb-4">
        <div className="card-title mb-4 text-[13px] font-bold">Notification preferences</div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 pr-4 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-text-dim">Alert type</th>
                {(['inApp', 'email', 'sms'] as Channel[]).map((ch) => (
                  <th key={ch} className="w-[140px] py-2 text-center text-[11px] font-semibold uppercase tracking-[0.5px] text-text-dim">
                    {ch === 'inApp' ? '🔔 In-app' : ch === 'email' ? '✉️ Email' : '📱 SMS'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => {
                const pref = prefs.find((p: NotifPref) => p.catId === cat.id)!
                return (
                  <tr key={cat.id} className="border-t border-border">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px]">{cat.icon}</span>
                        <div>
                          <div className="text-[12px] font-semibold text-text">{cat.label}</div>
                          <div className="text-[10.5px] text-text-dim">{cat.desc}</div>
                        </div>
                      </div>
                    </td>
                    {(['inApp', 'email', 'sms'] as Channel[]).map((ch) => (
                      <td key={ch} className="py-3 text-center">
                        <select
                          value={pref[ch]}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFreq(cat.id, ch, e.target.value as Freq)}
                          className="rounded-lg border border-border bg-bg px-2 py-1.5 text-[11px] outline-none focus:border-ai-purple"
                          style={{ color: FREQ_COLOR[pref[ch] as Freq] }}
                        >
                          {FREQ_OPTS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other settings */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">🌐 Language & region</div>
          <div className="space-y-3">
            {[
              { label: 'Interface language', value: 'English' },
              { label: 'Date format', value: 'DD MMM YYYY' },
              { label: 'Number format', value: 'Indian (₹ / Lakh / Cr)' },
              { label: 'Timezone', value: 'IST (UTC+5:30)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-[11.5px] text-text-dim">{label}</span>
                <span className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] text-text">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">🔐 Security</div>
          <div className="space-y-3">
            {[
              { label: 'Two-factor auth', value: 'Enabled (OTP)' },
              { label: 'Session timeout', value: '8 hours' },
              { label: 'Last login', value: '11 Jun 2026, 09:14 IST' },
              { label: 'IP whitelist', value: 'Not configured' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-[11.5px] text-text-dim">{label}</span>
                <span className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] text-text">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
