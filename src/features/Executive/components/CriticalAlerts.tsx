import type { CriticalAlert, DetailPanelKey } from '../types'

interface CriticalAlertsProps {
  alerts: CriticalAlert[]
  onOpenPanel: (key: DetailPanelKey) => void
  onToast: (msg: string) => void
}

/**
 * 🚨 Critical Alerts — Action Required
 * Top-level exception panel: 4 P1 cards with left crimson stripe + action buttons.
 * (Prototype's .exc-panel-top with .exc-cards-row.)
 */
export function CriticalAlerts({ alerts, onOpenPanel, onToast }: CriticalAlertsProps) {
  const p1Count = alerts.length
  return (
    <div className="mb-[14px] bg-[var(--exec-surface)] border-[2px] border-[var(--exec-crimson-border)] border-t-[4px] border-t-[var(--exec-crimson)] rounded-[14px] py-[14px] px-[18px] shadow-[0_4px_20px_rgba(220,53,69,0.1)] max-[1024px]:py-[13px] max-[1024px]:px-[15px] max-[640px]:py-[12px] max-[640px]:px-[14px] max-[480px]:py-[10px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <div className="flex items-center justify-between gap-[10px] mb-[12px] flex-wrap max-[480px]:gap-[8px] max-[480px]:mb-[10px]">
        <div className="font-['Syne',_serif] text-[15px] font-bold text-[var(--exec-crimson)] flex items-center gap-[8px] flex-wrap max-[1024px]:text-[14px] max-[640px]:text-[13.5px] max-[480px]:text-[12.5px] max-[480px]:gap-[6px]">
          🚨 Critical Alerts — Action Required
          <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[11px] bg-[var(--exec-crimson)] text-white rounded-[100px] py-[2px] px-[10px] font-semibold max-[480px]:text-[10px] max-[480px]:px-[8px]">
            {p1Count} P1 · 4 P2
          </span>
        </div>
        <button
          type="button"
          className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] py-[4px] px-[12px] rounded-[6px] border border-[var(--exec-crimson-border)] text-[var(--exec-crimson)] cursor-pointer bg-[var(--exec-crimson-bg)] transition-[all_0.15s] whitespace-nowrap hover:bg-[var(--exec-crimson)] hover:text-white max-[480px]:text-[9.5px] max-[480px]:px-[10px]"
          onClick={() => onOpenPanel('alert1')}
        >
          View All Exceptions →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-[8px] max-[1200px]:grid-cols-4 max-[1200px]:gap-[7px] max-[1024px]:grid-cols-2 max-[1024px]:gap-[8px] max-[480px]:grid-cols-1 max-[480px]:gap-[7px]">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="relative overflow-hidden bg-[var(--exec-crimson-bg)] border-[1.5px] border-[var(--exec-crimson-border)] rounded-[10px] py-[11px] px-[13px] cursor-pointer transition-[all_0.18s] flex flex-col min-w-0 hover:[transform:translateY(-2px)] hover:shadow-[var(--exec-shadow-md)] max-[640px]:py-[10px] max-[640px]:px-[12px] max-[480px]:py-[9px] max-[480px]:px-[11px]"
            onClick={() => { onToast(a.cardToast); onOpenPanel(a.panelKey) }}
            role="button"
            tabIndex={0}
          >
            {/* Accent stripe (was .exc-card.p1::before) */}
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[5px] rounded-[2px_0_0_2px] bg-[var(--exec-crimson)]" />
            <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.1em] text-[var(--exec-crimson)] uppercase mb-[3px] break-words max-[480px]:text-[8.5px]">{a.eyebrow}</div>
            <div className="text-[12px] font-bold text-[var(--exec-ink)] mb-[3px] break-words max-[480px]:text-[11.5px]">{a.title}</div>
            <div className="text-[10.5px] text-[var(--exec-ink3)] leading-[1.4] break-words max-[480px]:text-[10px]">{a.detail}</div>
            <div className="flex items-center justify-between mt-[8px] gap-[6px] flex-wrap">
              <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold text-[var(--exec-crimson)] break-words max-[480px]:text-[9.5px]">{a.impact}</span>
              <button
                type="button"
                className="text-[11px] py-[5px] px-[13px] rounded-[5px] font-bold border border-[var(--exec-crimson)] bg-[var(--exec-crimson)] text-white cursor-pointer transition-[filter_0.15s] shadow-[0_1px_4px_rgba(28,31,46,0.18)] whitespace-nowrap hover:[filter:brightness(1.1)] hover:[transform:translateY(-1px)] max-[480px]:text-[10.5px] max-[480px]:px-[11px]"
                onClick={(e) => { e.stopPropagation(); onToast(a.actionToast) }}
              >
                {a.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
