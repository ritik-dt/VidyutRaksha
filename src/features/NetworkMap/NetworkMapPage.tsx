import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import { useNetworkMap } from './hooks/useNetworkMap'
import { NetworkMapKpiStrip } from './components/NetworkMapKpiStrip'
import { LayerToggles } from './components/LayerToggles'
import { TopHotspotsPanel } from './components/TopHotspotsPanel'
import { MapContainer } from './components/MapContainer'
import { MapDetailPanel } from './components/MapDetailPanel'
import { MapLegend } from './components/MapLegend'
import { SyntheticDataBanner } from './components/SyntheticDataBanner'

export default function NetworkMapPage() {
  const { showToast } = useToast()
  const {
    scope,
    scopeName,
    allFeeders,
    allDts,
    enrichedFeeders,
    kpis,
    topHotspots,
    isEmpty,
    hasSynthetic,
    isAllSynthetic,
    realMeters,
    realMetersCount,
    layers,
    toggleLayer,
    navCtx,
    setNavCtx,
    closeDetail,
  } = useNetworkMap()

  const aiInsight = isEmpty ? (
    <>
      No network data is currently mapped at scope{' '}
      <strong className="text-ai-purple">{scopeName}</strong>. The VidyutRaksha pilot is currently
      scoped to <strong className="text-ai-purple">KVVNL Varanasi Zone</strong> — drill into{' '}
      <strong className="text-ai-purple">UPPCL → KVVNL → Varanasi</strong> (or use the scope
      picker) to see the mapped feeders, DTs, and consumers. State-wide network rollout planned
      for FY26 under RDSS.
    </>
  ) : (
    <>
      I've mapped <strong className="text-ai-purple">{formatIndian(allDts.length)} DTRs</strong>{' '}
      across <strong className="text-ai-purple">{allFeeders.length} feeders</strong> at scope{' '}
      <strong className="text-ai-purple">{scopeName}</strong>.{' '}
      <strong style={{ color: 'var(--red)' }}>
        {kpis.hotspotsCount} feeders
      </strong>{' '}
      show &gt;24% AT&C loss, accounting for the bulk of theft signal here.
      {kpis.topFeeder && (
        <>
          {' '}
          <strong style={{ color: 'var(--red)' }}>{kpis.topFeeder.name}</strong> leads at{' '}
          {(kpis.topFeeder.loss || 0).toFixed(1)}% loss — recommend coordinated raid.
        </>
      )}{' '}
      <strong style={{ color: 'var(--green)' }}>
        {realMetersCount} real meters from MRI data
      </strong>{' '}
      are highlighted with ✓ markers. Use the layer toggles below to filter views. Click any feeder
      row at right to drill into its cases.
    </>
  )

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="🗺️ Network intelligence map"
        subtitle="Theft-focused ops view — feeders, DTs, and consumers with click-through to case detail"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Layer presets',
                  message: 'Tap any layer toggle below the map to filter what you see.',
                  duration: 3500,
                })
              }
            >
              ⚡ Layer presets
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI loss hotspots',
                  message: `Analyzing ${allFeeders.length} feeders and ${allDts.length} DTRs across ${scopeName} for coordinated theft patterns.`,
                  duration: 4500,
                })
              }
            >
              ✦ AI loss hotspots
            </button>
          </>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{
              fontSize: 10.5,
              padding: '4px 10px',
              color: 'var(--ai-purple)',
              borderColor: 'rgba(124,58,237,0.3)',
            }}
            onClick={() => {
              // Prototype opens a scope picker modal; we jump to root (or
              // no-op if already at root) which lets the user re-drill.
              if (scope.hierPath.length > 1) {
                scope.navigateToPathIndex(0)
              } else {
                showToast({
                  type: 'info',
                  title: 'Change scope',
                  message:
                    'Use the top-bar scope selector or click a KPI card to drill into a specific division.',
                  duration: 3500,
                })
              }
            }}
            title="Change scope"
          >
            ↕ Change scope
          </button>
        }
      />

      {hasSynthetic && <SyntheticDataBanner isAllSynthetic={isAllSynthetic} />}

      <NetworkMapKpiStrip kpis={kpis} />

      <AiInsightBanner title={`AI geographic analysis — ${scopeName}`}>
        {aiInsight}
      </AiInsightBanner>

      <LayerToggles
        layers={layers}
        onToggle={toggleLayer}
        feedersCount={allFeeders.length}
        dtsCount={allDts.length}
        realMetersCount={realMetersCount}
      />

      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
        <ErrorBoundary>
          {/*
            Was `.map-wrapper` — flex row with map (flex-1) + detail panel
            (340px) inside a rounded card. Collapses to flex-col at ≤900px
            with min-height, so the map + panel stack cleanly.
          */}
          <div className="flex gap-0 h-[540px] rounded-[12px] overflow-hidden border border-[var(--border)] bg-[var(--card)] max-[900px]:flex-col max-[900px]:h-auto max-[900px]:min-h-[460px]">
            <MapContainer
              feeders={enrichedFeeders}
              dts={allDts}
              layers={layers}
              onSelect={setNavCtx}
              realMeters={realMeters}
              navCtx={navCtx}
            />
            <MapDetailPanel
              navCtx={navCtx}
              onSelect={setNavCtx}
              onClose={closeDetail}
              allDts={allDts}
              allFeeders={enrichedFeeders}
            />
          </div>
        </ErrorBoundary>

        <TopHotspotsPanel hotspots={topHotspots} />
      </div>

      <MapLegend />
    </div>
  )
}
