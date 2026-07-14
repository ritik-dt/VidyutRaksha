import type { CSSProperties } from 'react'
import type { EvidenceTile } from '../types'

interface EvidencePackCardProps {
  tiles: EvidenceTile[]
  caseLabel: string
  onVerifyChain: () => void
  onDownload: () => void
}

/** The 6-artefact evidence pack assembled for a confirmed case. */
export function EvidencePackCard({
  tiles,
  caseLabel,
  onVerifyChain,
  onDownload,
}: EvidencePackCardProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title aud-ev-title">
        ✦ Recent evidence pack — {caseLabel}
      </div>

      <div className="aud-ev-strip">
        {tiles.map((t) => (
          <div
            key={t.title}
            className="aud-ev-tile"
            style={{ '--aud-ev-color': t.color } as CSSProperties}
          >
            <div className="aud-ev-icon">{t.icon}</div>
            <div className="aud-ev-name">{t.title}</div>
            <div className="aud-ev-detail">{t.detail}</div>
          </div>
        ))}
      </div>

      <div className="aud-ev-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onVerifyChain}>
          🔍 Verify chain
        </button>
        <button type="button" className="btn btn-ai btn-sm" onClick={onDownload}>
          ⬇ Download evidence pack
        </button>
      </div>
    </div>
  )
}
