import type { DT, Feeder } from '../types'

/** Zone spec — matches prototype's zoneSpecs shape byte-for-byte. */
interface ZoneSpec {
  center: { lat: number; lng: number }
  discom: string
  circle: string
  subdivs: (string | null)[]
  feeders: number
  dtsPerFeeder: number
  lossRange: [number, number]
  localities: string[]
}

/**
 * Zone centers + specs — byte-identical port of prototype's `zoneCenters` and `zoneSpecs`.
 * Iteration order preserved (matches prototype ordering, which controls feederSerial + dtSerial
 * assignment across zones).
 */
const ZONE_SPECS: Record<string, ZoneSpec> = {
  azamgarh: {
    center: { lat: 26.0683, lng: 83.1836 }, discom: 'kvvnl',
    circle: 'azm_c1', subdivs: [null], feeders: 4, dtsPerFeeder: 3, lossRange: [18, 24],
    localities: ['Civil Lines', 'Jiyanpur', 'Tarwa', 'Bilariyaganj'],
  },
  jaunpur: {
    center: { lat: 25.7361, lng: 82.6843 }, discom: 'kvvnl',
    circle: 'jnp_c1', subdivs: [null], feeders: 3, dtsPerFeeder: 3, lossRange: [19, 23],
    localities: ['Olandganj', 'Shahganj', 'Kerakat'],
  },
  dvvnl_prayagraj: {
    center: { lat: 25.4358, lng: 81.8463 }, discom: 'dvvnl',
    circle: 'dvvnl_prayagraj_c1',
    subdivs: ['dvvnl_prayagraj_sd1', 'dvvnl_prayagraj_sd2', 'dvvnl_prayagraj_sd3', 'dvvnl_prayagraj_sd4'],
    feeders: 5, dtsPerFeeder: 3, lossRange: [20, 27],
    localities: ['Civil Lines', 'Naini', 'Phaphamau', 'Jhusi', 'Allenganj'],
  },
  dvvnl_jhansi: {
    center: { lat: 25.4484, lng: 78.5685 }, discom: 'dvvnl',
    circle: 'dvvnl_jhansi_c1',
    subdivs: ['dvvnl_jhansi_sd1', 'dvvnl_jhansi_sd2', 'dvvnl_jhansi_sd3', 'dvvnl_jhansi_sd4'],
    feeders: 4, dtsPerFeeder: 2, lossRange: [18, 24],
    localities: ['Sipri Bazaar', 'Civil Lines', 'Kanpur Road', 'Premnagar'],
  },
  mvvnl_lucknow: {
    center: { lat: 26.8467, lng: 80.9462 }, discom: 'mvvnl',
    circle: 'mvvnl_lucknow_c1',
    subdivs: ['mvvnl_lucknow_sd1', 'mvvnl_lucknow_sd2', 'mvvnl_lucknow_sd3', 'mvvnl_lucknow_sd4'],
    feeders: 6, dtsPerFeeder: 4, lossRange: [15, 22],
    localities: ['Hazratganj', 'Aliganj', 'Gomti Nagar', 'Indira Nagar', 'Mahanagar', 'Aminabad'],
  },
  mvvnl_kanpur: {
    center: { lat: 26.4499, lng: 80.3319 }, discom: 'mvvnl',
    circle: 'mvvnl_kanpur_c1',
    subdivs: ['mvvnl_kanpur_sd1', 'mvvnl_kanpur_sd2', 'mvvnl_kanpur_sd3', 'mvvnl_kanpur_sd4'],
    feeders: 5, dtsPerFeeder: 3, lossRange: [17, 24],
    localities: ['Kakadeo', 'Govind Nagar', 'Swaroop Nagar', 'Kalyanpur', 'Panki'],
  },
  pvvnl_meerut: {
    center: { lat: 28.9845, lng: 77.7064 }, discom: 'pvvnl',
    circle: 'pvvnl_meerut_c1',
    subdivs: ['pvvnl_meerut_sd1', 'pvvnl_meerut_sd2', 'pvvnl_meerut_sd3', 'pvvnl_meerut_sd4'],
    feeders: 4, dtsPerFeeder: 3, lossRange: [14, 21],
    localities: ['Sadar Bazaar', 'Begum Bridge', 'Pallavpuram', 'Jagrati Vihar'],
  },
  pvvnl_agra: {
    center: { lat: 27.1767, lng: 78.0081 }, discom: 'pvvnl',
    circle: 'pvvnl_agra_c1',
    subdivs: ['pvvnl_agra_sd1', 'pvvnl_agra_sd2', 'pvvnl_agra_sd3', 'pvvnl_agra_sd4'],
    feeders: 5, dtsPerFeeder: 3, lossRange: [16, 22],
    localities: ['Sadar Bazaar', 'Trans Yamuna', 'Khandari', 'Dayalbagh', 'Sikandra'],
  },
  pvvnl_bareilly: {
    center: { lat: 28.3670, lng: 79.4304 }, discom: 'pvvnl',
    circle: 'pvvnl_bareilly_c1',
    subdivs: ['pvvnl_bareilly_sd1', 'pvvnl_bareilly_sd2', 'pvvnl_bareilly_sd3', 'pvvnl_bareilly_sd4'],
    feeders: 3, dtsPerFeeder: 2, lossRange: [16, 21],
    localities: ['Civil Lines', 'Subhash Nagar', 'Rampur Road'],
  },
  puvvnl_gorakhpur: {
    center: { lat: 26.7606, lng: 83.3732 }, discom: 'puvvnl',
    circle: 'puvvnl_gorakhpur_c1',
    subdivs: ['puvvnl_gorakhpur_sd1', 'puvvnl_gorakhpur_sd2', 'puvvnl_gorakhpur_sd3', 'puvvnl_gorakhpur_sd4'],
    feeders: 4, dtsPerFeeder: 3, lossRange: [18, 24],
    localities: ['Civil Lines', 'Mohaddipur', 'Asuran Chowk', 'Padri Bazaar'],
  },
  puvvnl_basti: {
    center: { lat: 26.7918, lng: 82.7340 }, discom: 'puvvnl',
    circle: 'puvvnl_basti_c1',
    subdivs: ['puvvnl_basti_sd1', 'puvvnl_basti_sd2', 'puvvnl_basti_sd3', 'puvvnl_basti_sd4'],
    feeders: 3, dtsPerFeeder: 2, lossRange: [20, 25],
    localities: ['Civil Lines', 'Walterganj', 'Harraiya'],
  },
}

/** Lehmer LCG — byte-identical to prototype's `sRng(seed)`. */
function sRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/**
 * Byte-identical port of the prototype's IIFE `addSyntheticFeedersAndDts`.
 * Generates feeders + DTs in a single interleaved loop per zone so the RNG stream
 * state matches the prototype exactly — every ID, position, loss, meter count,
 * flagged count, critical count, load value will be identical to the prototype.
 */
export function buildSyntheticGeo(): { feeders: Feeder[]; dts: DT[] } {
  const feeders: Feeder[] = []
  const dts: DT[] = []
  let feederSerial = 100
  let dtSerial = 5000

  Object.entries(ZONE_SPECS).forEach(([zoneId, spec]) => {
    const center = spec.center
    // Same seed formula the prototype uses
    const seed = zoneId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const rng = sRng(seed)

    for (let fi = 0; fi < spec.feeders; fi++) {
      const fAngle = rng() * Math.PI * 2
      const fDist = 0.005 + rng() * 0.020
      const fLat = center.lat + Math.sin(fAngle) * fDist
      const fLng = center.lng + Math.cos(fAngle) * fDist
      const localityName = spec.localities[fi % spec.localities.length]
      const feederId = localityName + '-F' + ++feederSerial
      // Round-robin sub-division assignment across the zone's sub-divisions
      const sdSlot = spec.subdivs[fi % spec.subdivs.length]

      feeders.push({
        id: feederId,
        lat: fLat,
        lng: fLng,
        area: localityName + ' Division',
        discom: spec.discom,
        zone: zoneId,
        circle: spec.circle,
        subdivision: sdSlot,
        division: null,
        _synthetic: true,
      })

      for (let di = 0; di < spec.dtsPerFeeder; di++) {
        const dAngle = rng() * Math.PI * 2
        const dDist = 0.001 + rng() * 0.0035
        const dLat = fLat + Math.sin(dAngle) * dDist
        const dLng = fLng + Math.cos(dAngle) * dDist
        const baseLoss = spec.lossRange[0] + rng() * (spec.lossRange[1] - spec.lossRange[0])
        const meters = Math.round(180 + rng() * 320)
        const flaggedFrac = 0.04 + (baseLoss - spec.lossRange[0]) / 80
        const flagged = Math.round(meters * flaggedFrac)
        const critical = Math.round(flagged * (0.10 + rng() * 0.20))
        const load = Math.round(55 + rng() * 40)
        const dtId = 'DTR-' + ++dtSerial

        dts.push({
          id: dtId,
          feeder: feederId,
          lat: dLat,
          lng: dLng,
          loss: Math.round(baseLoss * 10) / 10,
          load,
          meters,
          flagged,
          critical,
          area: localityName + ' DTR ' + (di + 1),
          _synthetic: true,
        })
      }
    }
  })

  return { feeders, dts }
}

/** Pre-computed once at module load — used by feederGeo.ts and dtGeo.ts. */
export const SYNTHETIC_GEO = buildSyntheticGeo()
