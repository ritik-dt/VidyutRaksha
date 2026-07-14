// ── Tone → CSS class mapping (pure) ──────────────────────────────────────────
// Turn semantic tone values ('jade', 'amber', 'crimson', 'brand') into the CSS
// class name that applies the corresponding colour. All classes live in
// app/index.css under the `.exec-scope` prefix.

import type { Tone, KpiStatus } from '../types'

/** Colour utility class for a text element with the given tone. */
export function textToneClass(tone?: Tone): string {
  switch (tone) {
    case 'jade':    return 'exec-text-jade'
    case 'amber':   return 'exec-text-amber'
    case 'crimson': return 'exec-text-crimson'
    case 'brand':   return 'exec-text-brand'
    default:        return ''
  }
}

/** Container class for the KPI-tile left accent stripe. */
export function kpiStatusClass(status: KpiStatus): string {
  return `exec-kpi-tile-${status}`
}

/** Progress-bar fill colour. */
export function progressFillClass(tone: 'good' | 'warn' | 'bad'): string {
  return `exec-progress-fill-${tone}`
}

/** DISCOM row bar tone. */
export function discomBarClass(tone: 'jade' | 'amber' | 'crimson'): string {
  return `exec-dc-bar-${tone}`
}

/** Reliability metric card tone. */
export function reliabilityToneClass(tone: 'good' | 'warn' | 'bad'): string {
  return `exec-rel-metric-${tone}`
}

/** Dues bucket variant → CSS modifier. */
export function duesBucketVariantClass(variant: 'young' | 'mid' | 'old' | 'never'): string {
  return `exec-dues-bucket-${variant}`
}
