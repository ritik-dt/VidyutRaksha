import type { DetailPanelKey, RevenueSnapshotData } from '../types'

interface RevenueSnapshotPanelProps {
  data: RevenueSnapshotData
  onOpenPanel: (key: DetailPanelKey) => void
}

function duesColor(variant: string): string {
  switch (variant) {
    case 'young': return 'var(--exec-amber)'
    case 'mid':   return '#F97316'
    case 'old':   return 'var(--exec-crimson)'
    case 'never': return '#1559B0'
    default:      return 'var(--exec-ink4)'
  }
}

function metricValColor(tone?: string): string {
  switch (tone) {
    case 'jade':    return 'var(--exec-jade)'
    case 'amber':   return 'var(--exec-amber)'
    case 'crimson': return 'var(--exec-crimson)'
    case 'brand':   return 'var(--exec-brand)'
    default:        return 'var(--exec-ink)'
  }
}

/** 💰 Revenue Snapshot — Billed, Collection, Outstanding Dues (crimson) with 4 aging buckets. */
export function RevenueSnapshotPanel({ data, onOpenPanel }: RevenueSnapshotPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        💰 <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Revenue</em> Snapshot
      </h3>

      <div className="flex flex-col gap-[8px]">
        {data.metrics.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-[10px] py-[8px] px-[12px] rounded-[8px] bg-[var(--exec-surface2)] border border-[var(--exec-border)] cursor-pointer transition-[all_0.15s] min-w-0 hover:bg-[var(--exec-brand-light)] hover:border-[var(--exec-brand)]"
            onClick={() => onOpenPanel(m.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="text-[11px] text-[var(--exec-ink3)]">{m.name}</div>
            <div className="text-right shrink-0">
              <div className="font-['Syne',_serif] text-[18px] font-bold max-[480px]:text-[16px]" style={{ color: metricValColor(m.tone) }}>{m.valueText}</div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{m.unit}</div>
            </div>
          </div>
        ))}

        {/* Outstanding Dues — crimson expanded block with 4 aging buckets */}
        <div
          className="flex justify-between gap-[10px] py-[8px] px-[12px] rounded-[8px] cursor-pointer transition-[all_0.15s] min-w-0 bg-[var(--exec-crimson-bg)] border border-[var(--exec-crimson-border)] flex-col items-start hover:[filter:brightness(1.02)]"
          onClick={() => onOpenPanel(data.duesTotal.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="flex justify-between w-full items-center gap-[8px]">
            <div className="text-[11px] text-[var(--exec-ink3)]">Outstanding Dues</div>
            <div className="text-right shrink-0">
              <div className="font-['Syne',_serif] text-[18px] font-bold text-[var(--exec-crimson)] max-[480px]:text-[16px]">{data.duesTotal.valueText}</div>
              <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink4)]">{data.duesTotal.unit}</div>
            </div>
          </div>

          <div className="flex flex-col gap-[4px] w-full">
            {data.duesBuckets.map((b) => {
              const color = duesColor(b.variant)
              const isNever = b.variant === 'never'
              return (
                <div
                  key={b.label}
                  className={`flex items-center gap-[8px] cursor-pointer${isNever ? ' mt-[2px] pt-[4px] border-t border-t-dashed border-t-[rgba(21,89,176,0.3)]' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onOpenPanel(b.panelKey) }}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className="text-[10px] whitespace-nowrap min-w-[90px] max-[640px]:min-w-[80px] max-[480px]:min-w-[70px] max-[480px]:text-[9.5px]"
                    style={{ color: isNever ? color : 'var(--exec-ink3)', fontWeight: isNever ? 700 : 400 }}
                  >
                    {b.label}
                  </div>
                  <div className="flex-1 h-[7px] bg-[var(--exec-bg3)] rounded-[4px] overflow-hidden min-w-0">
                    <div className="h-full rounded-[4px] max-w-full" style={{ width: `${b.percent}%`, background: color }} />
                  </div>
                  <div
                    className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-semibold min-w-[56px] text-right max-[480px]:min-w-[48px] max-[480px]:text-[9.5px]"
                    style={{ color }}
                  >
                    {b.valueText}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Never-paid alert box */}
          <div
            className="mt-[7px] py-[6px] px-[10px] rounded-[7px] bg-[rgba(91,33,182,0.08)] border border-[rgba(91,33,182,0.2)] text-[10px] text-[var(--exec-brand-dark)] leading-[1.4] w-full cursor-pointer hover:[filter:brightness(1.05)] hover:[transform:translateY(-1px)]"
            style={{ color: '#1559B0' }}
            dangerouslySetInnerHTML={{ __html: data.neverPaidAlert }}
          />
        </div>
      </div>
    </section>
  )
}
