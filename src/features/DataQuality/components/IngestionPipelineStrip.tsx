import type { CSSProperties } from 'react'
import type { PipelineStat } from '../types'

interface IngestionPipelineStripProps {
  stats: PipelineStat[]
}

/** Today's ingestion pipeline — 5 tiles with a coloured left border. */
export function IngestionPipelineStrip({ stats }: IngestionPipelineStripProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">Today&apos;s ingestion pipeline status</div>
      <div className="dq-pipeline">
        {stats.map((s) => (
          <div
            key={s.label}
            className="dq-pipe-tile"
            style={{ '--dq-pipe-color': s.color } as CSSProperties}
          >
            <div className="dq-pipe-icon">{s.icon}</div>
            <div className="dq-pipe-label">{s.label}</div>
            <div className="dq-pipe-val">{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
