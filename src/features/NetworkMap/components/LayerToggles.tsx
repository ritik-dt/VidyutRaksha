import type { LayerVisibility, MapLayerId } from '../types'

interface LayerTogglesProps {
  layers: LayerVisibility
  onToggle: (id: MapLayerId) => void
  feedersCount: number
  dtsCount: number
  realMetersCount: number
}

/** 6 layer toggle pills — direct port of prototype's map-controls row. */
export function LayerToggles({
  layers,
  onToggle,
  feedersCount,
  dtsCount,
  realMetersCount,
}: LayerTogglesProps) {
  const btnClass = (id: MapLayerId) =>
    'map-toggle' + (layers[id] ? ' active' : '')

  return (
    <div className="map-controls">
      <button type="button" className={btnClass('feeders')} onClick={() => onToggle('feeders')}>
        ⚡ Feeders ({feedersCount})
      </button>
      <button type="button" className={btnClass('dts')} onClick={() => onToggle('dts')}>
        🔶 DTRs ({dtsCount})
      </button>
      <button type="button" className={btnClass('consumers')} onClick={() => onToggle('consumers')}>
        👤 Consumers
      </button>
      <button type="button" className={btnClass('real')} onClick={() => onToggle('real')}>
        ✓ Real meters ({realMetersCount})
      </button>
      <button type="button" className={btnClass('lines')} onClick={() => onToggle('lines')}>
        — Connections
      </button>
      <button type="button" className={btnClass('heat')} onClick={() => onToggle('heat')}>
        🔥 Loss heatmap
      </button>
    </div>
  )
}
