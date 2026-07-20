import type { DetailPanelKey, MeteringHealthData } from '../types'

interface MeteringHealthPanelProps {
  data: MeteringHealthData
  onOpenPanel: (key: DetailPanelKey) => void
}

function progressGradient(tone: string): string {
  switch (tone) {
    case 'good': return 'linear-gradient(90deg, #22C55E, #4ADE80)'
    case 'warn': return 'linear-gradient(90deg, #D97706, #FBBF24)'
    case 'bad':  return 'linear-gradient(90deg, #EF4444, #F87171)'
    default:     return 'linear-gradient(90deg, #1B72E8, #2680F5)'
  }
}

function statValColor(tone: string): string {
  switch (tone) {
    case 'good': return 'var(--exec-jade)'
    case 'warn': return 'var(--exec-amber)'
    case 'bad':  return 'var(--exec-crimson)'
    default:     return 'var(--exec-ink)'
  }
}

function ageColor(age: string): string {
  switch (age) {
    case 'fresh': return '#D97706'
    case 'mid':   return '#F97316'
    case 'old':   return '#EF4444'
    default:      return 'var(--exec-ink4)'
  }
}

/** 📟 Metering Health — Smart Meter Coverage, Communication Success, Non-COM, Never COM, Non-COM Ageing. */
export function MeteringHealthPanel({ data, onOpenPanel }: MeteringHealthPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        📟 <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Metering</em> Health
      </h3>

      <div className="flex flex-col gap-[8px]">
        {data.stats.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-[3px] cursor-pointer"
            onClick={() => onOpenPanel(s.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="flex justify-between items-center gap-[8px]">
              <div
                className="text-[11px]"
                style={{
                  color: s.nameStyle === 'emphasis' ? 'var(--exec-crimson)' : 'var(--exec-ink3)',
                  fontWeight: s.nameStyle === 'emphasis' ? 600 : 400,
                }}
              >
                {s.name}
              </div>
              <div
                className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[12px] font-semibold"
                style={{ color: statValColor(s.tone) }}
              >
                {s.valueText}
              </div>
            </div>
            <div className="h-[8px] bg-[var(--exec-bg3)] rounded-[4px] overflow-hidden">
              <div
                className="h-full rounded-[4px] transition-[width_0.7s] max-w-full"
                style={{ width: `${s.barPercent}%`, background: progressGradient(s.tone) }}
              />
            </div>
          </div>
        ))}

        {/* Non-COM Ageing breakdown */}
        <div className="mt-[8px] pt-[8px] border-t border-t-[var(--exec-border)]">
          <div className="text-[10.5px] font-semibold text-[var(--exec-ink2)] mb-[5px] flex items-center justify-between">
            {data.nonCom.title}
            <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] text-[var(--exec-crimson)] font-semibold">{data.nonCom.countText}</span>
          </div>
          <div className="flex flex-col gap-[3px]">
            {data.nonCom.buckets.map((b) => {
              const color = ageColor(b.age)
              return (
                <div key={b.label} className="flex items-center gap-[6px]">
                  <div className="text-[9.5px] text-[var(--exec-ink4)] whitespace-nowrap min-w-[68px] max-[480px]:min-w-[58px] max-[480px]:text-[9px]">{b.label}</div>
                  <div className="flex-1 h-[6px] bg-[var(--exec-bg3)] rounded-[3px] overflow-hidden min-w-0">
                    <div className="h-full rounded-[3px] max-w-full" style={{ width: `${b.barPercent}%`, background: color }} />
                  </div>
                  <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] min-w-[40px] text-right max-[480px]:min-w-[34px] max-[480px]:text-[9px]" style={{ color }}>
                    {b.valueText}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tamper Alerts (Today) */}
        <div className="flex flex-col gap-[3px] cursor-pointer">
          <div className="flex justify-between items-center gap-[8px]">
            <div className="text-[11px] text-[var(--exec-ink3)]">{data.tamperToday.name}</div>
            <div
              className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[12px] font-semibold"
              style={{ color: 'var(--exec-crimson)' }}
            >
              {data.tamperToday.valueText}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
