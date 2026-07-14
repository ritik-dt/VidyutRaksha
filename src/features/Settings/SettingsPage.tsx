import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopePill } from '@/shared/components/ui/ScopePill'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { AlertRulesTable } from './components/AlertRulesTable'
import { ChannelDestinationsCard } from './components/ChannelDestinationsCard'
import { NotifPrefsTable } from './components/NotifPrefsTable'
import { QuietHoursCard } from './components/QuietHoursCard'
import { useSettings } from './hooks/useSettings'

/**
 * Settings — notification preferences for the active role.
 *
 * Faithful to the prototype's renderSettings(): the header, AI insight,
 * preference checkboxes and channel destinations are all ROLE-reactive, and
 * preferences persist per role (NotifPrefsContext) so switching role and back
 * restores what that role had. Saving logs to the activity trail, which the
 * Audit screen consumes.
 */
export default function SettingsPage() {
  const s = useSettings()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()

  function handleSave() {
    showToast({
      type: 'success',
      title: 'Preferences saved',
      message: `Notification settings updated for ${s.role.label}.`,
      duration: 3000,
    })
    logActivity('Updated notification preferences', 'settings', s.role.label)
  }

  function handleReset() {
    s.resetPrefs()
    showToast({
      type: 'success',
      title: 'Defaults restored',
      message: `Reset notification preferences for ${s.role.label}.`,
      duration: 3000,
    })
  }

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="⚙️ Settings"
        subtitle={`Notification preferences for ${s.role.label} (${s.role.level}) · changes apply to your role only`}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
              ↻ Reset to {s.role.level} defaults
            </button>
            <button type="button" className="btn btn-ai btn-sm" onClick={handleSave}>
              💾 Save preferences
            </button>
          </>
        }
      />

      <ScopePill />

      <AiInsightBanner
        title={`✦ Smart defaults for ${s.role.label}`}
        className="mb-[14px]"
      >
        <span dangerouslySetInnerHTML={{ __html: s.insightHtml }} />
      </AiInsightBanner>

      <NotifPrefsTable
        categories={s.categories}
        channels={s.channels}
        freqOptions={s.freqOptions}
        pref={s.pref}
        onToggle={(cat, ch, val) => s.updatePref(cat, ch, val)}
        onFreq={(cat, freq) => s.updatePref(cat, 'freq', freq)}
      />

      <AlertRulesTable
        rules={s.alertRules}
        blurb={s.alertRulesBlurb}
        roleLabel={s.role.label}
        onAddRule={() =>
          showToast({
            type: 'info',
            title: 'New rule wizard',
            message: 'Define trigger condition, severity, channels, and recipients.',
            duration: 3500,
          })
        }
        onEditRule={(r) =>
          showToast({
            type: 'info',
            title: 'Edit rule',
            message: `Open rule editor for ${r.name}.`,
            duration: 2500,
          })
        }
      />

      <div className="grid-2">
        <QuietHoursCard
          quietHours={s.quietHours}
          onChange={s.setQuietHours}
          blurb={s.quietHoursBlurb}
          noteHtml={s.quietHoursNoteHtml}
        />
        <ChannelDestinationsCard
          destinations={s.destinations}
          onChange={s.setDestination}
        />
      </div>
    </div>
  )
}
