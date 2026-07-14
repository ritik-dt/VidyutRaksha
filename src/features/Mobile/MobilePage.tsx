import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { MobileKpiStrip } from './components/MobileKpiStrip'
import { FeaturesCard } from './components/FeaturesCard'
import { LiveActivityCard } from './components/LiveActivityCard'
import { MobilePhoneMock } from './components/MobilePhoneMock'
import { WorkflowStrip } from './components/WorkflowStrip'
import { MOBILE_STATS } from './data/mobile'

export default function MobilePage() {
  const { showToast } = useToast()

  return (
    <div className="pb-2">
      <PageHeader
        title="📱 Inspector mobile app"
        subtitle="Full-featured field app — offline mode, photo capture, geo-tag, e-signature"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'App link generated',
                  message: 'Install link sent to your registered mobile number via SMS.',
                  duration: 3500,
                })
              }
            >
              📲 Generate app link
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Sync status',
                  message: `${MOBILE_STATS.syncedPhotosToday} photos + ${MOBILE_STATS.syncedSignaturesToday} signatures synced today. ${MOBILE_STATS.offlineQueue} pending in offline queue.`,
                  duration: 4000,
                })
              }
            >
              🔄 Sync status
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI field assistant">
        The inspector mobile app runs on Android (min v8.0).{' '}
        <strong className="text-ai-purple">Works fully offline</strong> — cases, remediation checklists, photos, and
        notes are cached locally and sync when connectivity returns. Today{' '}
        <strong className="text-ai-purple">{MOBILE_STATS.inspectorsInField} inspectors</strong> are in the field,{' '}
        <strong className="text-ai-purple">{MOBILE_STATS.pendingInspections} inspections</strong> scheduled, and{' '}
        <strong className="text-ai-purple">
          {MOBILE_STATS.syncedPhotosToday} photos + {MOBILE_STATS.syncedSignaturesToday} signatures
        </strong>{' '}
        synced so far.
      </AiInsightBanner>

      <MobileKpiStrip stats={MOBILE_STATS} />

      <div className="grid-2 mb-3.5 gap-3.5">
        <div>
          <FeaturesCard />
          <LiveActivityCard />
        </div>
        <MobilePhoneMock />
      </div>

      <WorkflowStrip />
    </div>
  )
}
