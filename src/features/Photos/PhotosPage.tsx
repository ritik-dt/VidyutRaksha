import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { PillTabs, type PillTabOption } from '@/shared/components/ui/PillTabs'
import { useToast } from '@/shared/context/ToastContext'
import { usePhotos } from './hooks/usePhotos'
import { PhotosKpiStrip } from './components/PhotosKpiStrip'
import { PhotoGrid } from './components/PhotoGrid'
import { PhotoCapabilitiesCard } from './components/PhotoCapabilitiesCard'
import { BeforeAfterCard } from './components/BeforeAfterCard'
import { PHOTO_STATS, PHOTO_TABS } from './data/photos'
import type { Photo, PhotoFilterId } from './types'

export default function PhotosPage() {
  const { showToast } = useToast()
  const {
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    filtered,
  } = usePhotos()
  const [search, setSearch] = useState('')

  const searchLower = search.trim().toLowerCase()
  const visiblePhotos = searchLower
    ? filtered.filter((p) =>
        `${p.case} ${p.consumer} ${p.id} ${p.tags.join(' ')} ${p.type}`
          .toLowerCase()
          .includes(searchLower),
      )
    : filtered

  const filterEntries: FilterPillEntry[] = []
  if (filter.filter) filterEntries.push({ label: 'View', value: 'Quality rejections' })
  if (filter.status) filterEntries.push({ label: 'Status', value: 'Needs review' })

  function handlePhotoClick(p: Photo) {
    showToast({
      type: 'info',
      title: `Photo ${p.id}`,
      message: `${p.type} · ${p.consumer} · ${p.case}. Verified: ${p.verified ? 'yes' : 'no'} · AI ${p.aiConf}%.`,
      duration: 3500,
    })
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="📷 Photo intelligence"
        subtitle="Evidence photos with AI analysis — tagged, geo-verified, court-ready"
        actions={
          <>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search photos by case, consumer, tag..."
              className="w-[240px] max-sm:w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] text-text placeholder:text-text-dim focus:border-ai-purple focus:outline-none"
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Downloading evidence pack',
                  message: 'Court-ready ZIP with all verified photos + EXIF metadata is being generated.',
                  duration: 3500,
                })
              }
            >
              ⬇ Download evidence pack
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI re-analyzing photos',
                  message: 'Running fresh classification, tag detection, and quality checks on all photos.',
                  duration: 3500,
                })
              }
            >
              ✦ AI re-analyze
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Photo intelligence"
          onBack={resetToDefault}
        />
      )}

      <AiInsightBanner title="AI photo analysis">
        <strong className="text-ai-purple">42 photos uploaded today</strong> across 8 active cases. AI has analyzed and
        tagged all photos with <strong className="text-ai-purple">94% average confidence</strong>.{' '}
        <strong className="text-ai-purple">5 photos flagged</strong> for review — low confidence or missing standard angles.
        Cases with complete evidence: 6 of 8. <strong className="text-ai-purple">Missing photos warning:</strong> Case
        C-20260412-007 needs a 'consumer face' photo for identity verification per UPPCL policy.
      </AiInsightBanner>

      <PhotosKpiStrip stats={PHOTO_STATS} onFilter={setFilter} />

      <PillTabs<PhotoFilterId>
        tabs={PHOTO_TABS as PillTabOption<PhotoFilterId>[]}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />

      <PhotoGrid photos={visiblePhotos} onCardClick={handlePhotoClick} />

      <div className="grid-2 mt-3.5 gap-3.5">
        <PhotoCapabilitiesCard />
        <BeforeAfterCard />
      </div>
    </div>
  )
}
