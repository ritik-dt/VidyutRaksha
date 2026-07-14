import type { EvidenceTile } from '../types'

/** The evidence pack assembled for a confirmed case. */
export const EVIDENCE_CASE = 'Case C-20260301-001 (HEERA LAL AGRAWAL)'

/** 6 artefacts in the pack, each with a coloured left border. */
export const EVIDENCE_TILES: EvidenceTile[] = [
  { icon: '📄', title: 'AI flag report',     detail: 'Generated 2026-04-02',          color: 'var(--red)' },
  { icon: '📊', title: 'Consumption trend',  detail: '12-month kWh data + analysis',  color: 'var(--id-text)' },
  { icon: '⚡', title: 'Tamper event log',   detail: '50 earth-loading events',       color: 'var(--amber)' },
  { icon: '📷', title: 'Inspection photos',  detail: '6 photos, geo-tagged',          color: 'var(--teal)' },
  { icon: '📋', title: 'Inspector notes',    detail: 'Detailed observations',         color: 'var(--green)' },
  { icon: '🔐', title: 'Digital signature',  detail: 'SHA-256 hash chain',            color: 'var(--ai-purple)' },
]
