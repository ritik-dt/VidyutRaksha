import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { useToast } from '@/shared/context/ToastContext'
import { useNotices } from './hooks/useNotices'
import { NoticesKpiStrip } from './components/NoticesKpiStrip'
import { NoticePreviewCard } from './components/NoticePreviewCard'
import { NoticeTemplatesCard } from './components/NoticeTemplatesCard'
import { RecentNoticesTable } from './components/RecentNoticesTable'
import {
  AI_INSIGHT,
  FEATURED_CASE_ID,
  HISTORY_COUNT,
  NOTICE_STATS,
  TEMPLATES_COUNT,
} from './data/notices'

export default function NoticesPage() {
  const { showToast } = useToast()
  const {
    language,
    setLanguage,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    filteredNotices,
  } = useNotices()

  const filterEntries: FilterPillEntry[] = []
  if (filter.status === 'sent') filterEntries.push({ label: 'Status', value: 'Sent' })

  return (
    <div className="pb-2">
      <PageHeader
        title="✉️ Consumer notices"
        subtitle="Auto-drafted Section 135 notices, appeal letters, and payment reminders"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: `Templates (${TEMPLATES_COUNT})`,
                  message: 'Choose a template from the panel on the right, or open the template library.',
                  duration: 3500,
                })
              }
            >
              📂 Templates ({TEMPLATES_COUNT})
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: `History (${HISTORY_COUNT})`,
                  message: `${HISTORY_COUNT} notices dispatched over the past 6 months.`,
                  duration: 3500,
                })
              }
            >
              📄 History ({HISTORY_COUNT})
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'Bulk generate',
                  message: 'Generating notices for 14 draft-ready assessments…',
                  duration: 4000,
                })
              }
            >
              ✦ Bulk generate
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Consumer notices"
          onBack={resetToDefault}
        />
      )}

      <AiInsightBanner title={AI_INSIGHT.title}>
        I've drafted a{' '}
        <strong className="text-ai-purple">Section 135 assessment notice</strong> for Case{' '}
        {AI_INSIGHT.caseId} ({AI_INSIGHT.consumer}). The notice includes all required elements:
        consumer details, theft method, evidence summary, step-by-step calculation, payment
        timeline, and appeal rights under Section 127. Available in{' '}
        <strong className="text-ai-purple">English and Hindi</strong>. Language auto-detected from
        consumer preference in CIS.
      </AiInsightBanner>

      <NoticesKpiStrip stats={NOTICE_STATS} onFilter={setFilter} />

      <div className="grid-2 mb-3.5 gap-3.5">
        <div className="flex min-w-0 flex-col [&_.card]:mb-0 [&_.card]:flex-1">
          <NoticePreviewCard
            language={language}
            onLanguageChange={(lang) =>
              setLanguage(lang) ??
              showToast({
                type: 'info',
                title: lang === 'en' ? 'English preview' : 'हिंदी preview',
                message:
                  lang === 'en'
                    ? 'Showing English version of the notice.'
                    : 'हिंदी संस्करण प्रदर्शित किया जा रहा है।',
                duration: 2500,
              })
            }
            onAttachEvidence={() =>
              showToast({
                type: 'info',
                title: 'Attach evidence',
                message: 'Select evidence items from the assessment package to attach to this notice.',
                duration: 3000,
              })
            }
            onEdit={() =>
              showToast({
                type: 'info',
                title: 'Edit notice',
                message: 'Opening in-place editor. Manual edits require an audit trail comment.',
                duration: 3000,
              })
            }
            onExportPdf={() =>
              showToast({
                type: 'success',
                title: 'PDF exported',
                message: `${FEATURED_CASE_ID}_notice.pdf downloaded to your device.`,
                duration: 3000,
              })
            }
            onEmail={() =>
              showToast({
                type: 'success',
                title: 'Email queued',
                message: 'Notice queued for email dispatch to the consumer on record.',
                duration: 3000,
              })
            }
            onSend={() =>
              showToast({
                type: 'success',
                title: '✓ Sent via SMS + Post',
                message:
                  'Notice dispatched via SMS + registered post. Digital signature recorded. Delivery status will update in 24-48 hrs.',
                duration: 4500,
              })
            }
          />
        </div>

        <div className="flex min-w-0 flex-col [&_.card]:mb-0 [&_.card]:flex-1">
          <NoticeTemplatesCard
            onSelect={(t) =>
              showToast({
                type: 'info',
                title: `Template: ${t.name}`,
                message: `Used ${t.usageCount} times. Loading into the preview…`,
                duration: 3000,
              })
            }
          />
        </div>
      </div>

      <RecentNoticesTable
        notices={filteredNotices}
        onView={(n) =>
          showToast({
            type: 'info',
            title: `Notice ${n.id}`,
            message: `${n.consumer} · ${n.type} · Response: ${n.response}. Opening full detail…`,
            duration: 3500,
          })
        }
      />
    </div>
  )
}
