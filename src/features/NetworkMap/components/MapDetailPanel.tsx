import type { DT, EnrichedFeeder, NavContext } from '../types'
import { FeederDetail } from './FeederDetail'
import { DTDetail } from './DTDetail'
import { ConsumerDetail } from './ConsumerDetail'

interface MapDetailPanelProps {
  navCtx: NavContext
  onSelect: (ctx: NavContext) => void
  onClose: () => void
  allDts: DT[]
  allFeeders: EnrichedFeeder[]
}

/**
 * Wrapper for the slide-in map-detail panel.
 *
 * Selects the appropriate detail component based on which entity is set in
 * navCtx (consumer > dt > feeder priority). When nothing is selected, panel
 * collapses to width 0 with a width-transition (`.map-detail.empty` in
 * prototype).
 *
 * Layout (was `.map-detail` in CSS):
 *   - Desktop: fixed 340px wide, right-of-map, own vertical scroll
 *   - ≤900px:  full-width below map, max-height 520px with max-height transition
 *   - Empty:   width 0 (desktop) / max-height 0 (mobile), no border
 */
export function MapDetailPanel({
  navCtx,
  onSelect,
  onClose,
  allDts,
  allFeeders,
}: MapDetailPanelProps) {
  const { feeder, dt, consumer } = navCtx
  const isEmpty = !feeder && !dt && !consumer

  // Two separate class sets — empty vs filled — instead of combining a base
  // `w-[340px]` with an `w-0` override. The override approach was broken:
  // Tailwind v4 emits arbitrary values (`.w-[340px]`) AFTER named values
  // (`.w-0`) in the compiled CSS, so when both classes are on the same
  // element the arbitrary one wins by source order. Result: the "empty"
  // panel would silently stay at 340px, squeezing the map area.
  //
  // Structure preserved from prototype `.map-detail` + `.map-detail.empty`:
  //   Desktop empty  → width 0, no border, overflow hidden
  //   Desktop filled → width 340, left border, overflow-y auto
  //   Mobile empty   → full width, max-height 0
  //   Mobile filled  → full width, max-height 520 (440 at ≤640), top border
  //   Transitions    → width on desktop, max-height on mobile (300ms)
  const shared =
    'shrink-0 bg-[var(--card)] transition-[width] duration-300 max-[900px]:transition-[max-height]'
  const emptyCls =
    'w-0 overflow-hidden max-[900px]:w-full max-[900px]:max-h-0'
  const filledCls =
    'w-[340px] overflow-y-auto border-l border-[var(--border)] ' +
    'max-[900px]:w-full max-[900px]:max-h-[520px] max-[900px]:border-l-0 ' +
    'max-[900px]:border-t max-[900px]:border-t-[var(--border)] ' +
    'max-[640px]:max-h-[440px]'
  const wrapperClass = `${shared} ${isEmpty ? emptyCls : filledCls}`

  if (isEmpty) {
    return <div className={wrapperClass} />
  }

  const showConsumer = consumer !== null
  const showDt = !showConsumer && dt !== null
  const showFeeder = !showConsumer && !showDt && feeder !== null

  const goBackToFeeder = () => {
    const feederId = feeder?.id ?? dt?.feeder ?? consumer?.feeder
    if (feederId) {
      const enrichedFeeder = allFeeders.find((f) => f.id === feederId) ?? null
      if (enrichedFeeder) {
        onSelect({ feeder: enrichedFeeder, dt: null, consumer: null })
        return
      }
    }
    onClose()
  }

  const goBackToDt = () => {
    const dtId = dt?.id ?? consumer?.dt
    if (dtId) {
      const parentDt = allDts.find((d) => d.id === dtId) ?? dt
      if (parentDt) {
        const parentFeeder =
          feeder ?? allFeeders.find((f) => f.id === parentDt.feeder) ?? null
        onSelect({ feeder: parentFeeder, dt: parentDt, consumer: null })
        return
      }
    }
    onClose()
  }

  return (
    <div className={wrapperClass}>
      {showFeeder && feeder && (
        <FeederDetail
          feeder={
            allFeeders.find((f) => f.id === feeder.id) ??
            ({
              ...feeder,
              loss: 0,
              meters: 0,
              consumers: 0,
              flagged: 0,
              critical: 0,
              dtCount: 0,
            } as EnrichedFeeder)
          }
          allDts={allDts}
          onSelect={onSelect}
          onClose={onClose}
        />
      )}
      {showDt && dt && (
        <DTDetail
          dt={dt}
          parentFeeder={feeder}
          onSelect={onSelect}
          onBack={goBackToFeeder}
          onClose={onClose}
        />
      )}
      {showConsumer && consumer && (
        <ConsumerDetail
          consumer={consumer}
          onBack={goBackToDt}
          onBackToFeeder={goBackToFeeder}
          onClose={onClose}
        />
      )}
    </div>
  )
}
