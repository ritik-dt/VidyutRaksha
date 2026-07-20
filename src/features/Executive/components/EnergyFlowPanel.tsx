import type { DetailPanelKey, EnergyFlowData } from '../types'

interface EnergyFlowPanelProps {
  data: EnergyFlowData
  onOpenPanel: (key: DetailPanelKey) => void
}

/** ⚡ Energy Flow panel — funnel with Input → Billed (OK + PROV) → Collected + Loss badge. */
export function EnergyFlowPanel({ data, onOpenPanel }: EnergyFlowPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        ⚡ Energy <em className="italic text-[var(--exec-brand)] font-normal not-italic-hack" style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Flow</em>
        <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.12em] py-[2px] px-[8px] rounded-[4px] bg-[var(--exec-brand-light)] text-[var(--exec-brand)]">FUNNEL</span>
      </h3>

      <div className="flex flex-col gap-[8px]">
        {/* Input Energy — 100% width blue bar */}
        <div
          className="flex items-center gap-[10px] cursor-pointer transition-[filter_0.18s] hover:[filter:brightness(1.05)] hover:[transform:translateY(-1px)]"
          onClick={() => onOpenPanel(data.input.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="text-[10.5px] text-[var(--exec-ink3)] whitespace-nowrap min-w-[72px] max-[640px]:min-w-[62px] max-[480px]:min-w-[54px] max-[480px]:text-[10px]">Input Energy</div>
          <div className="flex-1 min-w-0">
            <div className="h-[32px] rounded-[6px] flex items-center px-[12px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[11px] font-semibold text-white whitespace-nowrap bg-[linear-gradient(90deg,_#1B72E8,_#2680F5)] w-full max-[480px]:h-[28px] max-[480px]:text-[10.5px] max-[480px]:px-[10px]">
              {data.input.valueText}
            </div>
          </div>
        </div>
        <div className="text-center text-[var(--exec-ink5)] text-[12px] pl-[76px] max-[640px]:pl-[66px] max-[480px]:pl-[58px]">↓</div>

        {/* Billed Energy — 78% width, split into OK (green) + PROV (dark green) */}
        <div
          className="flex items-center gap-[10px] cursor-pointer transition-[filter_0.18s] hover:[filter:brightness(1.05)] hover:[transform:translateY(-1px)]"
          onClick={() => onOpenPanel(data.billed.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="text-[10.5px] text-[var(--exec-ink3)] whitespace-nowrap min-w-[72px] max-[640px]:min-w-[62px] max-[480px]:min-w-[54px] max-[480px]:text-[10px]">Billed Energy</div>
          <div className="flex-1 min-w-0">
            <div className="w-[78%]">
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] text-[var(--exec-ink3)] mb-[3px] flex items-baseline gap-[6px]">
                {data.billed.totalText.startsWith('Total: ') ? (
                  <>Total: <strong className="text-[var(--exec-jade)] text-[11px]">{data.billed.totalText.replace('Total: ', '')}</strong></>
                ) : (
                  <strong>{data.billed.totalText}</strong>
                )}
              </div>
              <div className="flex gap-[2px] w-full">
                <div
                  className="h-[28px] flex items-center justify-center gap-[3px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold text-white whitespace-nowrap px-[8px] bg-[linear-gradient(90deg,_#22C55E,_#4ADE80)] rounded-[6px_0_0_6px] max-[480px]:h-[26px] max-[480px]:text-[9.5px] max-[480px]:px-[6px]"
                  style={{ flex: data.billed.okSegment.flex }}
                >
                  {data.billed.okSegment.valueText}
                  <span className="text-[8px] border border-[rgba(255,255,255,0.5)] rounded-[3px] py-[1px] px-[4px] opacity-90">{data.billed.okSegment.tag}</span>
                </div>
                <div
                  className="h-[28px] flex items-center justify-center gap-[3px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold text-white whitespace-nowrap px-[8px] bg-[linear-gradient(90deg,_#2e9e72,_#4fd4a8)] rounded-[0_6px_6px_0] border-l-[2px] border-l-dashed border-l-[rgba(255,255,255,0.45)] max-[480px]:h-[26px] max-[480px]:text-[9.5px] max-[480px]:px-[6px]"
                  style={{ flex: data.billed.provSegment.flex }}
                >
                  {data.billed.provSegment.valueText}
                  <span className="text-[8px] border border-[rgba(255,255,255,0.5)] rounded-[3px] py-[1px] px-[4px] opacity-90">{data.billed.provSegment.tag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-[var(--exec-ink5)] text-[12px] pl-[76px] max-[640px]:pl-[66px] max-[480px]:pl-[58px]">↓</div>

        {/* Collected — 68% width amber bar */}
        <div
          className="flex items-center gap-[10px] cursor-pointer transition-[filter_0.18s] hover:[filter:brightness(1.05)] hover:[transform:translateY(-1px)]"
          onClick={() => onOpenPanel(data.collected.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="text-[10.5px] text-[var(--exec-ink3)] whitespace-nowrap min-w-[72px] max-[640px]:min-w-[62px] max-[480px]:min-w-[54px] max-[480px]:text-[10px]">Collected</div>
          <div className="flex-1 min-w-0">
            <div className="h-[32px] rounded-[6px] flex items-center px-[12px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[11px] font-semibold text-white whitespace-nowrap bg-[linear-gradient(90deg,_#D97706,_#FBBF24)] w-[68%] max-[480px]:h-[28px] max-[480px]:text-[10.5px] max-[480px]:px-[10px]">
              {data.collected.valueText}
            </div>
          </div>
        </div>
      </div>

      {/* Loss badge */}
      <div
        className="mt-[12px] py-[8px] px-[14px] bg-[var(--exec-crimson-bg)] border border-[var(--exec-crimson-border)] rounded-[8px] flex items-center gap-[8px] cursor-pointer transition-[transform_0.18s] hover:[transform:translateY(-1px)] hover:shadow-[var(--exec-shadow-sm)]"
        onClick={() => onOpenPanel(data.lossGap.panelKey)}
        role="button"
        tabIndex={0}
      >
        <div className="font-['Syne',_serif] text-[24px] font-bold text-[var(--exec-crimson)] leading-none shrink-0 max-[640px]:text-[22px] max-[480px]:text-[20px]">
          {data.lossGap.valueText}
        </div>
        <div className="text-[11.5px] text-[var(--exec-crimson)] leading-[1.4] max-[480px]:text-[10.5px]">
          Total Loss Gap<br />
          <strong>{data.lossGap.percentText}</strong> {data.lossGap.monetaryText}
        </div>
      </div>
    </section>
  )
}
