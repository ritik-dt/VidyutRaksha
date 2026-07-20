import type { ConsumerAnalyticsData, DetailPanelKey } from '../types'

interface ConsumerAnalyticsPanelProps {
  data: ConsumerAnalyticsData
  onOpenPanel: (key: DetailPanelKey) => void
  onToast: (msg: string) => void
}

// Tamper-tile tone → bg/border/text/stripe colours.
function tamperTone(tone: string): { bg: string; border: string; text: string; stripe: string } {
  switch (tone) {
    case 'crimson': return { bg: 'var(--exec-crimson-bg)', border: 'var(--exec-crimson-border)', text: 'var(--exec-crimson)', stripe: 'var(--exec-crimson)' }
    case 'amber':   return { bg: 'var(--exec-amber-bg)',   border: 'var(--exec-amber-border)',   text: 'var(--exec-amber)',   stripe: 'var(--exec-amber)' }
    case 'jade':    return { bg: 'var(--exec-jade-bg)',    border: 'var(--exec-jade-border)',    text: 'var(--exec-jade)',    stripe: 'var(--exec-jade)' }
    case 'brand':
    default:        return { bg: 'var(--exec-brand-light)', border: 'rgba(27,114,232,0.2)',      text: 'var(--exec-brand)',   stripe: 'var(--exec-brand)' }
  }
}

function dcDotColor(tone: string): string {
  switch (tone) {
    case 'jade':    return 'var(--exec-jade)'
    case 'amber':   return 'var(--exec-amber)'
    case 'crimson': return 'var(--exec-crimson)'
    default:        return 'var(--exec-ink4)'
  }
}

function dcFillGradient(tone: string): string {
  switch (tone) {
    case 'jade':    return 'linear-gradient(90deg, #22C55E, #4ADE80)'
    case 'amber':   return 'linear-gradient(90deg, #D97706, #FBBF24)'
    case 'crimson': return 'linear-gradient(90deg, #EF4444, #F87171)'
    default:        return 'linear-gradient(90deg, #1B72E8, #2680F5)'
  }
}

function pipeTone(tone: string): { bg: string; border: string; text: string } {
  switch (tone) {
    case 'crimson': return { bg: 'var(--exec-crimson-bg)', border: 'var(--exec-crimson-border)', text: 'var(--exec-crimson)' }
    case 'amber':   return { bg: 'var(--exec-amber-bg)',   border: 'var(--exec-amber-border)',   text: 'var(--exec-amber)' }
    case 'jade':    return { bg: 'var(--exec-jade-bg)',    border: 'var(--exec-jade-border)',    text: 'var(--exec-jade)' }
    default:        return { bg: 'var(--exec-surface2)',   border: 'var(--exec-border)',         text: 'var(--exec-ink2)' }
  }
}

function actionBtnTone(tone: string): { bg: string; border: string; text: string } {
  switch (tone) {
    case 'crimson': return { bg: 'var(--exec-crimson-bg)', border: 'var(--exec-crimson-border)', text: 'var(--exec-crimson)' }
    case 'amber':   return { bg: 'var(--exec-amber-bg)',   border: 'var(--exec-amber-border)',   text: 'var(--exec-amber)' }
    case 'brand':   return { bg: 'var(--exec-brand-light)', border: 'rgba(27,114,232,0.2)',       text: 'var(--exec-brand)' }
    case 'jade':    return { bg: 'var(--exec-jade-bg)',    border: 'var(--exec-jade-border)',    text: 'var(--exec-jade)' }
    default:        return { bg: 'var(--exec-brand-light)', border: 'rgba(27,114,232,0.2)',       text: 'var(--exec-brand)' }
  }
}

/**
 * 🔍 Consumer Analytics — Tamper & Theft (map-panel in prototype).
 * 4 stat cards + DISCOM tamper chart + investigation pipeline + 4 action buttons.
 */
export function ConsumerAnalyticsPanel({ data, onOpenPanel, onToast }: ConsumerAnalyticsPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        🔍 Consumer <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Analytics</em> — Tamper &amp; Theft
        <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.12em] py-[2px] px-[8px] rounded-[4px] bg-[var(--exec-brand-light)] text-[var(--exec-brand)]">ACTIONABLE</span>
      </h3>

      {/* Summary KPI row — 2×2 grid of tamper stat tiles */}
      <div className="grid grid-cols-2 gap-[6px] mb-[10px] max-[480px]:grid-cols-1">
        {data.tamperTiles.map((t) => {
          const c = tamperTone(t.tone)
          return (
            <div
              key={t.eyebrow}
              className="relative overflow-hidden rounded-[9px] py-[9px] px-[12px] cursor-pointer transition-[transform_0.15s] border hover:[transform:translateY(-1px)] hover:shadow-[var(--exec-shadow-sm)]"
              style={{ background: c.bg, borderColor: c.border }}
              onClick={() => onOpenPanel(t.panelKey)}
              role="button"
              tabIndex={0}
            >
              <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px] rounded-[2px_0_0_2px]" style={{ background: c.stripe }} />
              <div
                className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[8.5px] tracking-[0.12em] uppercase mb-[2px]"
                style={{ color: c.text }}
              >
                {t.eyebrow}
              </div>
              <div
                className="font-['Syne',_serif] text-[26px] font-bold leading-none break-words max-[1024px]:text-[22px] max-[640px]:text-[20px] max-[480px]:text-[18px]"
                style={{ color: c.text }}
              >
                {t.value}
              </div>
              <div
                className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] mt-[1px] break-words"
                style={{ color: c.text }}
              >
                {t.detail}
              </div>
            </div>
          )
        })}
      </div>

      {/* DISCOM tamper chart */}
      <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.2em] uppercase text-[var(--exec-ink4)] mb-[8px] flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-px after:bg-[var(--exec-border)]">
        Tamper Cases by DISCOM — This Month
      </div>
      <div className="flex flex-col gap-[6px] mb-[10px]">
        {data.discoms.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-[6px] cursor-pointer py-[2px] transition-[opacity_0.15s] hover:opacity-85"
            onClick={() => { onToast(d.toastMessage); onOpenPanel(d.panelKey) }}
            role="button"
            tabIndex={0}
          >
            <div className="text-[10.5px] font-semibold min-w-[54px] text-[var(--exec-ink2)] flex items-center gap-[3px] max-[480px]:min-w-[46px] max-[480px]:text-[10px]">
              <span className="w-[7px] h-[7px] rounded-full inline-block shrink-0" style={{ background: dcDotColor(d.tone) }} />
              {d.name}
            </div>
            <div className="flex-1 h-[22px] bg-[var(--exec-bg3)] rounded-[5px] overflow-hidden relative min-w-0 max-[480px]:h-[18px]">
              <div
                className="h-full rounded-[5px] flex items-center px-[8px] transition-[width_0.7s] max-w-full"
                style={{ width: `${d.percent}%`, background: dcFillGradient(d.tone) }}
              >
                <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[10px] font-bold text-white whitespace-nowrap">{d.cases.toLocaleString()}</span>
              </div>
            </div>
            <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[8.5px] text-[var(--exec-ink5)] min-w-[36px] text-right max-[480px]:min-w-[30px]">{d.priority}</div>
          </div>
        ))}
      </div>

      {/* Investigation pipeline */}
      <div className="border-t border-t-[var(--exec-border)] pt-[9px] mt-[4px]">
        <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.2em] uppercase text-[var(--exec-ink4)] mb-[8px] flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-px after:bg-[var(--exec-border)]">
          Investigation Pipeline
        </div>
        <div className="flex flex-col gap-[5px]">
          {data.pipeline.map((p) => {
            const c = pipeTone(p.tone)
            return (
              <div
                key={p.label}
                className="flex items-center justify-between gap-[8px] py-[6px] px-[10px] rounded-[7px] border min-w-0"
                style={{ background: c.bg, borderColor: c.border }}
              >
                <span className="text-[11px] font-semibold break-words" style={{ color: c.text }}>{p.emoji} {p.label}</span>
                <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[12px] font-bold shrink-0" style={{ color: c.text }}>{p.count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action buttons — 2×2 grid */}
      <div className="mt-[9px] grid grid-cols-2 gap-[5px] max-[640px]:grid-cols-1">
        {data.actionButtons.map((a) => {
          const c = actionBtnTone(a.tone)
          return (
            <button
              key={a.label}
              type="button"
              className="text-center py-[7px] px-[10px] text-[10.5px] rounded-[7px] border cursor-pointer font-semibold transition-[filter_0.15s] break-words hover:[filter:brightness(1.05)] hover:[transform:translateY(-1px)]"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
              onClick={() => onToast(a.toast)}
            >
              {a.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
