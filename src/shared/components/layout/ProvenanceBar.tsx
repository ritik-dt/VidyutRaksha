import { useState, type KeyboardEvent } from 'react'
import { LineageModal } from './LineageModal'

export function ProvenanceBar() {
  const [lineageOpen, setLineageOpen] = useState(false)

  const open = () => setLineageOpen(true)

  return (
    <>
      <div
        id="provenanceBar"
        onClick={open}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            open()
          }
        }}
        role="button"
        tabIndex={0}
        title="Click for full data lineage"
        className="flex cursor-pointer flex-wrap items-center justify-between gap-3.5 border-b border-border px-4 py-[5px] text-[10px] text-text-mid md:px-[18px]"
        style={{
          background:
            'linear-gradient(90deg, rgba(40, 167, 69, 0.04) 0%, rgba(124, 58, 237, 0.04) 100%)',
        }}
      >
        {/* Detail cluster — only when the sidebar is expanded (lg and up) */}
        <div className="hidden flex-wrap items-center gap-3.5 lg:flex">
          <span className="flex items-center gap-[5px]">
            <span className="inline-block size-1.5 animate-pulse-dot rounded-full bg-green shadow-[0_0_6px_rgba(40,167,69,0.5)]" />
            <strong className="text-text">Live</strong>
          </span>
          <span>
            <strong className="text-text">Source:</strong> KVVNL Varanasi Zone ·
            Mar 2026 MRI batch
          </span>
          <span>
            <strong className="text-text">Coverage:</strong> 1,116 consumers · 49
            DTRs · 10 feeders
          </span>
          <span className="max-xl:hidden">
            <strong className="text-text">Window:</strong> 28-day rolling +
            lifetime tamper history
          </span>
          <span className="max-xl:hidden">
            <strong className="text-text">Categories:</strong> 16 tamper signals
          </span>
          <span className="max-xl:hidden">
            <strong className="text-text">Refreshed:</strong> 06 May 07:00 IST
          </span>
        </div>

        {/* Lineage trigger — the only thing visible when the sidebar is collapsed */}
        <span className="flex shrink-0 items-center gap-1 font-bold text-ai-purple">
          <span className="lg:hidden">📡 Data lineage</span>
          <span>Lineage →</span>
        </span>
      </div>

      <LineageModal open={lineageOpen} onClose={() => setLineageOpen(false)} />
    </>
  )
}
