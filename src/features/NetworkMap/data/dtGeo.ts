import type { DT } from '../types'
import { SYNTHETIC_GEO } from './syntheticBuilder'

/**
 * 14 real Varanasi DTRs — byte-identical to prototype's `dtGeo` real entries.
 * All fields (id, feeder, lat, lng, loss, load, meters, flagged, critical, area) match.
 */
const REAL_DTS: DT[] = [
  { id: 'DTR-1849', feeder: 'Bhelupur',   lat: 25.3045, lng: 82.9970, loss: 21.9, load: 87, meters: 412, flagged: 84,  critical: 18, area: 'Kamachha (HEERA LAL zone)' },
  { id: 'DTR-2231', feeder: 'Bhelupur',   lat: 25.3070, lng: 82.9925, loss: 13.6, load: 65, meters: 328, flagged: 14,  critical: 2,  area: 'Bhelupur West' },
  { id: 'DTR-0887', feeder: 'Rathayatra', lat: 25.3200, lng: 83.0080, loss: 24.2, load: 91, meters: 586, flagged: 147, critical: 34, area: 'Rathayatra Crossing' },
  { id: 'DTR-0234', feeder: 'Rathayatra', lat: 25.3160, lng: 83.0010, loss: 24.0, load: 78, meters: 467, flagged: 112, critical: 26, area: 'Lanka' },
  { id: 'DTR-1098', feeder: 'Chowk',      lat: 25.3220, lng: 82.9890, loss: 11.7, load: 55, meters: 294, flagged: 9,   critical: 1,  area: 'Vishwanath Gali' },
  { id: 'DTR-0556', feeder: 'Sigra',      lat: 25.3300, lng: 82.9760, loss: 16.5, load: 72, meters: 524, flagged: 38,  critical: 6,  area: 'Sigra Main' },
  { id: 'DTR-0112', feeder: 'Sigra',      lat: 25.3270, lng: 82.9740, loss: 9.9,  load: 61, meters: 352, flagged: 6,   critical: 0,  area: 'Sigra North' },
  { id: 'DTR-0901', feeder: 'Mahanagar',  lat: 25.3460, lng: 82.9670, loss: 24.6, load: 82, meters: 608, flagged: 178, critical: 42, area: 'Mahanagar Crossing' },
  { id: 'DTR-1234', feeder: 'Mahanagar',  lat: 25.3440, lng: 82.9620, loss: 10.8, load: 68, meters: 286, flagged: 11,  critical: 1,  area: 'Mahanagar Plaza' },
  { id: 'DTR-0445', feeder: 'Gomti',      lat: 25.3390, lng: 82.9930, loss: 26.9, load: 94, meters: 734, flagged: 218, critical: 58, area: 'Gomti East (high-loss)' },
  { id: 'DTR-0678', feeder: 'Gomti',      lat: 25.3370, lng: 82.9900, loss: 16.3, load: 73, meters: 381, flagged: 24,  critical: 3,  area: 'Gomti South' },
  { id: 'DTR-0332', feeder: 'Chauk',      lat: 25.3150, lng: 82.9790, loss: 24.5, load: 88, meters: 489, flagged: 128, critical: 31, area: 'Chauk Bazaar' },
  { id: 'DTR-0790', feeder: 'Cantt',      lat: 25.3390, lng: 82.9560, loss: 14.2, load: 70, meters: 312, flagged: 18,  critical: 2,  area: 'Cantt Station' },
  { id: 'DTR-1502', feeder: 'Hazratganj', lat: 25.3110, lng: 82.9670, loss: 18.0, load: 75, meters: 445, flagged: 42,  critical: 7,  area: 'Hazratganj East' },
]

/**
 * Combined DT set — 14 real Varanasi + synthetic non-pilot zones.
 * Order matches prototype: [...realDts, ...syntheticDts], synthetic generated
 * interleaved per zone with the same RNG stream as their parent feeders.
 */
export const DT_GEO: DT[] = [...REAL_DTS, ...SYNTHETIC_GEO.dts]
