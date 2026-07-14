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
 * Selects the appropriate detail component based on which entity is set in navCtx
 * (consumer > dt > feeder priority). When nothing is selected, panel is collapsed.
 */
export function MapDetailPanel({ navCtx, onSelect, onClose, allDts, allFeeders }: MapDetailPanelProps) {
  const { feeder, dt, consumer } = navCtx
  const isEmpty = !feeder && !dt && !consumer

  if (isEmpty) {
    return <div className="map-detail empty" />
  }

  const showConsumer = consumer !== null
  const showDt = !showConsumer && dt !== null
  const showFeeder = !showConsumer && !showDt && feeder !== null

  // For back navigation from DT → feeder
  const goBackToFeeder = () => {
    // Prefer the feeder already in navCtx; fall back to looking up via dt.feeder
    const feederId = feeder?.id ?? dt?.feeder
    if (feederId) {
      const enrichedFeeder = allFeeders.find((f) => f.id === feederId) ?? null
      if (enrichedFeeder) {
        onSelect({ feeder: enrichedFeeder, dt: null, consumer: null })
        return
      }
    }
    onClose()
  }

  // For back navigation from consumer → dt
  const goBackToDt = () => {
    // Prefer the dt already in navCtx; fall back to looking up via consumer.dt
    const dtId = dt?.id ?? consumer?.dt
    if (dtId) {
      const parentDt = allDts.find((d) => d.id === dtId) ?? dt
      if (parentDt) {
        const parentFeeder = feeder ?? allFeeders.find((f) => f.id === parentDt.feeder) ?? null
        onSelect({ feeder: parentFeeder, dt: parentDt, consumer: null })
        return
      }
    }
    onClose()
  }

  return (
    <div className="map-detail">
      {showFeeder && feeder && (
        <FeederDetail
          feeder={
            allFeeders.find((f) => f.id === feeder.id) ??
            ({ ...feeder, loss: 0, meters: 0, consumers: 0, flagged: 0, critical: 0, dtCount: 0 } as EnrichedFeeder)
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
          onClose={onClose}
        />
      )}
    </div>
  )
}
