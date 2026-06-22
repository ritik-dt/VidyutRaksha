import type { KeyboardEvent } from 'react'
import { useToast } from '@/shared/context/ToastContext'

export function ProvenanceBar() {
  const { showToast } = useToast()

  const showLineageToast = () => {
    showToast({
      type: 'info',
      title: 'Data Lineage',
      message:
        'Full provenance overlay (pipeline flow, source systems, refresh cadence) will be migrated in Phase 7.',
      duration: 5000,
    })
  }

  return (
    <div
      id="provenanceBar"
      onClick={showLineageToast}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          showLineageToast()
        }
      }}
      role="button"
      tabIndex={0}
      title="Click for full data lineage"
      className="flex cursor-pointer flex-wrap items-center justify-between gap-3.5 border-b border-border px-[18px] py-[5px] text-[10px] text-text-mid"
      style={{
        background:
          'linear-gradient(90deg, rgba(40, 167, 69, 0.04) 0%, rgba(124, 58, 237, 0.04) 100%)',
      }}
    >
      <div className="flex flex-wrap items-center gap-3.5">
        <span className="flex items-center gap-[5px]">
          <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-green shadow-[0_0_6px_rgba(40,167,69,0.5)]" />
          <strong className="text-text">Live</strong>
        </span>
        <span>
          <strong className="text-text">Source:</strong> KVVNL Varanasi Zone · Mar
          2026 MRI batch
        </span>
        <span>
          <strong className="text-text">Coverage:</strong> 1,116 consumers · 49
          DTRs · 10 feeders
        </span>
        <span>
          <strong className="text-text">Window:</strong> 28-day rolling + lifetime
          tamper history
        </span>
        <span>
          <strong className="text-text">Categories:</strong> 16 tamper signals
        </span>
        <span>
          <strong className="text-text">Refreshed:</strong> 06 May 07:00 IST
        </span>
      </div>
      <span className="shrink-0 font-bold text-ai-purple">Lineage →</span>
    </div>
  )
}
