import type { DT, MapConsumer } from '../types'

const CATS = ['Domestic', 'Commercial', 'Industrial', 'Agricultural'] as const
const THEFT_TYPES = [
  'Earth Loading',
  'Meter Bypass',
  'Magnetic Tamper',
  'Tariff Misuse',
  'Neutral Disturbance',
  'CT Manipulation',
]

/** Deterministic RNG matching the prototype's `sRng(seed)`. */
function sRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/**
 * Generate the full synthetic consumer set for a list of DTs.
 * - `flagged` first N are flagged (theft)
 * - `critical` first M are critical
 * - Rest are normal
 * - Scattered around DT center 0.001-0.0035 radius
 * Matches the prototype's `_dg.forEach((dt,di)=>{...})` block exactly.
 */
export function generateConsumers(dts: DT[]): MapConsumer[] {
  const out: MapConsumer[] = []
  dts.forEach((dt, di) => {
    const rng = sRng(di * 1000 + 42)
    for (let i = 0; i < dt.meters; i++) {
      const isCritical = i < (dt.critical || 0)
      const isFlagged = i < (dt.flagged || 0)
      const isTheft = isFlagged
      const cat = CATS[Math.floor(rng() * (isTheft ? 2 : 4))]
      const risk = isCritical
        ? Math.round(80 + rng() * 18)
        : isFlagged
          ? Math.round(60 + rng() * 20)
          : Math.round(5 + rng() * 40)
      const drop = isTheft ? -Math.round(30 + rng() * 50) : Math.round(-10 + rng() * 15)
      const events = isCritical
        ? Math.round(20 + rng() * 60)
        : isFlagged
          ? Math.round(5 + rng() * 20)
          : Math.round(rng() * 3)
      const kwh = Math.round(
        cat === 'Industrial'
          ? 800 + rng() * 1200
          : cat === 'Commercial'
            ? 300 + rng() * 500
            : 100 + rng() * 300,
      )
      const angle = rng() * Math.PI * 2
      const dist = 0.001 + rng() * 0.0035
      const lat = dt.lat + Math.sin(angle) * dist
      const lng = dt.lng + Math.cos(angle) * dist
      const tt = isTheft ? THEFT_TYPES[Math.floor(rng() * THEFT_TYPES.length)] : null
      const mid = 'M' + String(1000000 + Math.floor(rng() * 9000000)).slice(0, 7)
      out.push({
        id: mid,
        dt: dt.id,
        feeder: dt.feeder,
        cat,
        risk,
        drop,
        events,
        kwh,
        isTheft,
        isCritical,
        lat,
        lng,
        theftType: tt,
        sl: cat === 'Industrial' ? '50 kW' : cat === 'Commercial' ? '15 kW' : '5 kW',
      })
    }
  })
  return out
}
