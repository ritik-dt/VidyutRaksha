import type { PipelineStat } from '../types'

/** Today's ingestion pipeline — 5 stat tiles with a coloured left border. */
export const PIPELINE_STATS: PipelineStat[] = [
  { label: 'Files received',      val: '18,562', color: 'var(--id-text)', icon: '📥' },
  { label: 'Successfully parsed', val: '18,420', color: 'var(--green)',   icon: '✓' },
  { label: 'Failed parsing',      val: '142',    color: 'var(--red)',     icon: '✗' },
  { label: 'Duplicate files',     val: '38',     color: 'var(--amber)',   icon: '↻' },
  { label: 'Avg parse time',      val: '0.42s',  color: 'var(--teal)',    icon: '⏱' },
]
