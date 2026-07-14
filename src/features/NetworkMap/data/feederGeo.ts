import type { Feeder } from '../types'
import { SYNTHETIC_GEO } from './syntheticBuilder'

/**
 * 9 real Varanasi Zone feeders — byte-identical to prototype's `feederGeo` real entries.
 * No `name` field on the objects — enrichFeeders computes it from `area` at read time,
 * matching the prototype's `f.name || f.area || (f.id + ' Feeder')` fallback.
 */
const REAL_FEEDERS: Feeder[] = [
  { id: 'Bhelupur',   lat: 25.3050, lng: 82.9950, area: 'Bhelupur Division',         discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: 'bhelupur', subdivision: 'sd_bhelupur' },
  { id: 'Rathayatra', lat: 25.3180, lng: 83.0050, area: 'Rathayatra Division',       discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Chowk',      lat: 25.3210, lng: 82.9870, area: 'Chowk Division (old city)', discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Sigra',      lat: 25.3290, lng: 82.9750, area: 'Sigra Division',            discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Mahanagar',  lat: 25.3450, lng: 82.9650, area: 'Mahanagar Division',        discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Gomti',      lat: 25.3380, lng: 82.9920, area: 'Gomti Division',            discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Chauk',      lat: 25.3140, lng: 82.9780, area: 'Chauk Division',            discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Cantt',      lat: 25.3380, lng: 82.9540, area: 'Cantonment',                discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
  { id: 'Hazratganj', lat: 25.3100, lng: 82.9650, area: 'Hazratganj East',           discom: 'kvvnl', zone: 'varanasi', circle: 'eudc1', division: null,       subdivision: null },
]

/**
 * Combined feeder set — 9 real Varanasi + synthetic non-pilot zones.
 * Order matches prototype: [...realFeeders, ...syntheticFeeders] with synthetic
 * generated in ZONE_SPECS iteration order (azamgarh → jaunpur → dvvnl_… → puvvnl_basti).
 */
export const FEEDER_GEO: Feeder[] = [...REAL_FEEDERS, ...SYNTHETIC_GEO.feeders]
