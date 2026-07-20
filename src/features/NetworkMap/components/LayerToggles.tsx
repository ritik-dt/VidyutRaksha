import type { LayerVisibility, MapLayerId } from '../types'

interface LayerTogglesProps {
  layers: LayerVisibility
  onToggle: (id: MapLayerId) => void
  feedersCount: number
  dtsCount: number
  realMetersCount: number
}

/**
 * 6 layer toggle pills — direct port of prototype's map-controls row.
 *
 * Replaces `.map-controls/.map-toggle` with pure Tailwind. Active pill uses
 * `--ai-purple` accent (border + bg tint + purple text). Mobile ≤640px
 * tightens gap (6px→4px) and pill padding + font-size (was
 * `@media (max-width:640px) .map-toggle { padding:4px 9px; font-size:10.5px }`).
 */
export function LayerToggles({
  layers,
  onToggle,
  feedersCount,
  dtsCount,
  realMetersCount,
}: LayerTogglesProps) {
  const pillClass = (isActive: boolean) =>
    'py-[5px] px-[12px] rounded-[14px] border text-[11px] cursor-pointer transition-colors duration-150 ' +
    'max-[640px]:!py-[4px] max-[640px]:!px-[9px] max-[640px]:!text-[10.5px] ' +
    (isActive
      ? 'border-[var(--ai-purple)] bg-[var(--ai-purple-light)] text-[var(--ai-purple)] font-semibold'
      : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-mid)]')

  return (
    <div className="flex gap-[6px] mb-[12px] flex-wrap max-[640px]:!gap-[4px] max-[640px]:!mb-[10px]">
      <button type="button" className={pillClass(layers.feeders)} onClick={() => onToggle('feeders')}>
        ⚡ Feeders ({feedersCount})
      </button>
      <button type="button" className={pillClass(layers.dts)} onClick={() => onToggle('dts')}>
        🔶 DTRs ({dtsCount})
      </button>
      <button type="button" className={pillClass(layers.consumers)} onClick={() => onToggle('consumers')}>
        👤 Consumers
      </button>
      <button type="button" className={pillClass(layers.real)} onClick={() => onToggle('real')}>
        ✓ Real meters ({realMetersCount})
      </button>
      <button type="button" className={pillClass(layers.lines)} onClick={() => onToggle('lines')}>
        — Connections
      </button>
      <button type="button" className={pillClass(layers.heat)} onClick={() => onToggle('heat')}>
        🔥 Loss heatmap
      </button>
    </div>
  )
}
