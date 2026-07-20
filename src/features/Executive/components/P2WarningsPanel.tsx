import type { DetailPanelKey, P2Warning } from '../types'

interface P2WarningsPanelProps {
  warnings: P2Warning[]
  onOpenPanel: (key: DetailPanelKey) => void
}

/** ⚠️ P2 Warnings — Follow-up Required (amber-toned 4-card grid). */
export function P2WarningsPanel({ warnings, onOpenPanel }: P2WarningsPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        ⚠️ P2 Warnings — <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Follow-up Required</em>
        <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.12em] py-[2px] px-[8px] rounded-[4px] bg-[var(--exec-brand-light)] text-[var(--exec-brand)]">{warnings.length} OPEN</span>
      </h3>
      <div className="grid grid-cols-4 gap-[8px] max-[1200px]:grid-cols-4 max-[1024px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-[7px]">
        {warnings.map((w) => (
          <div
            key={w.id}
            className="bg-[var(--exec-amber-bg)] border border-[var(--exec-amber-border)] rounded-[10px] py-[12px] px-[14px] cursor-pointer transition-[all_0.18s] relative overflow-hidden flex flex-col min-w-0 hover:[transform:translateY(-2px)] hover:shadow-[var(--exec-shadow-sm)]"
            onClick={() => onOpenPanel(w.panelKey)}
            role="button"
            tabIndex={0}
          >
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--exec-amber)]" />
            <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.1em] text-[var(--exec-amber)] uppercase mb-[4px]">{w.eyebrow}</div>
            <div className="text-[12px] font-bold text-[var(--exec-ink)] mb-[3px] break-words">{w.title}</div>
            <div className="text-[10.5px] text-[var(--exec-ink3)] leading-[1.4] break-words">{w.detail}</div>
            <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold text-[var(--exec-amber)] mt-[6px]">{w.badge}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
