import type { DemandGenerationData, DetailPanelKey } from '../types'

interface DemandGenerationPanelProps {
  data: DemandGenerationData
  onOpenPanel: (key: DetailPanelKey) => void
}

// Bar gradient by tone (was .dg-bar-fill inline styles in prototype).
function dgFillGradient(gradient: string): string {
  switch (gradient) {
    case 'crimson': return 'linear-gradient(90deg,#EF4444,#F87171)'
    case 'jade':    return 'linear-gradient(90deg,#22C55E,#4ADE80)'
    case 'brand':
    default:        return 'linear-gradient(90deg,#1B72E8,#2680F5)'
  }
}

function dgNumColor(tone?: string): string {
  switch (tone) {
    case 'crimson': return 'var(--exec-crimson)'
    case 'jade':    return 'var(--exec-jade)'
    case 'brand':   return 'var(--exec-brand)'
    case 'amber':   return 'var(--exec-amber)'
    default:        return 'var(--exec-ink)'
  }
}

/** 🔋 Demand vs Generation — 3 comparison bars + deficit alert + 3-cell summary. */
export function DemandGenerationPanel({ data, onOpenPanel }: DemandGenerationPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        🔋 Demand <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>vs Generation</em>
      </h3>

      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-between items-baseline mb-[4px]">
          <span className="text-[11.5px] font-semibold text-[var(--exec-ink2)]">Supply–Demand Balance</span>
          <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[12px] font-semibold text-[var(--exec-crimson)]">{data.balanceText}</span>
        </div>

        {data.rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-[8px] cursor-pointer transition-[filter_0.18s] hover:[filter:brightness(1.05)]"
            onClick={() => onOpenPanel(r.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="text-[10px] text-[var(--exec-ink4)] whitespace-nowrap min-w-[78px] max-[640px]:min-w-[68px] max-[480px]:min-w-[58px] max-[480px]:text-[9.5px]">{r.label}</div>
            <div className="flex-1 h-[18px] bg-[var(--exec-bg3)] rounded-[5px] overflow-hidden relative min-w-0 max-[480px]:h-[16px]">
              <div
                className="h-full rounded-[5px] flex items-center px-[7px] transition-[width_0.5s_ease] max-w-full"
                style={{ width: `${r.percent}%`, background: dgFillGradient(r.gradient) }}
              >
                <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">{r.valueText}</span>
              </div>
            </div>
            <div
              className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10.5px] font-semibold min-w-[44px] text-right max-[480px]:text-[10px] max-[480px]:min-w-[40px]"
              style={{ color: dgNumColor(r.gradient) }}
            >
              {r.numericText}
            </div>
          </div>
        ))}

        <div
          className="mt-[6px] py-[7px] px-[10px] bg-[var(--exec-crimson-bg)] border border-[var(--exec-crimson-border)] rounded-[7px] flex items-center justify-between gap-[8px] cursor-pointer flex-wrap"
          onClick={() => onOpenPanel(data.deficitAlert.panelKey)}
          role="button"
          tabIndex={0}
        >
          <span className="text-[10.5px] text-[var(--exec-crimson)] font-semibold">{data.deficitAlert.text}</span>
          <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[14px] font-bold text-[var(--exec-crimson)]">{data.deficitAlert.valueText}</span>
        </div>
      </div>

      <div className="mt-[8px] grid grid-cols-3 gap-[4px] max-[640px]:gap-[4px]">
        {data.summary.map((s) => (
          <div
            key={s.label}
            className="text-center py-[9px] px-[8px] rounded-[7px] border-[1.5px] border-[var(--exec-border2)] bg-[var(--exec-surface)] shadow-[var(--exec-shadow-xs)] cursor-pointer transition-[all_0.15s] hover:border-[var(--exec-brand)] hover:bg-[var(--exec-brand-light)]"
            onClick={() => onOpenPanel(s.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div
              className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[14px] font-bold max-[640px]:text-[12px]"
              style={{ color: dgNumColor(s.tone) }}
            >
              {s.valueText}
            </div>
            <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[8.5px] text-[var(--exec-ink4)] tracking-[0.08em] uppercase mt-[1px] max-[640px]:text-[7.5px]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
