import type { DetailPanelKey, Insight } from '../types'

interface AutoInsightsPanelProps {
  insights: Insight[]
  onOpenPanel: (key: DetailPanelKey) => void
}

function tagColors(variant: string): { bg: string; text: string } {
  switch (variant) {
    case 'critical': return { bg: 'var(--exec-crimson-bg)', text: 'var(--exec-crimson)' }
    case 'warning':  return { bg: 'var(--exec-amber-bg)',   text: 'var(--exec-amber)' }
    case 'info':
    default:         return { bg: 'var(--exec-brand-light)', text: 'var(--exec-brand)' }
  }
}

/** 🤖 Auto Insights — vertical list of AI-generated insights (sidebar in prototype). */
export function AutoInsightsPanel({ insights, onOpenPanel }: AutoInsightsPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        🤖 Auto <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Insights</em>
      </h3>
      <div className="flex flex-col gap-[8px] flex-1">
        {insights.map((i) => {
          const tc = tagColors(i.tagVariant)
          return (
            <div
              key={i.id}
              className="py-[11px] px-[13px] rounded-[9px] border border-[var(--exec-border)] bg-[var(--exec-surface2)] cursor-pointer transition-[all_0.18s] flex gap-[10px] items-start min-w-0 hover:bg-[var(--exec-surface)] hover:shadow-[var(--exec-shadow-sm)] hover:[transform:translateX(2px)] max-[480px]:py-[9px] max-[480px]:px-[11px] max-[480px]:gap-[8px]"
              onClick={() => onOpenPanel(i.panelKey)}
              role="button"
              tabIndex={0}
            >
              <div className="text-[16px] shrink-0 mt-[1px] max-[480px]:text-[14px]">{i.icon}</div>
              <div className="min-w-0 flex-1">
                <div
                  className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.1em] py-[2px] px-[7px] rounded-[4px] mb-[4px] inline-block max-[480px]:text-[8.5px]"
                  style={{ background: tc.bg, color: tc.text }}
                >
                  {i.tag}
                </div>
                <div
                  className="text-[11.5px] text-[var(--exec-ink2)] leading-[1.5] break-words [&_strong]:text-[var(--exec-crimson)] max-[480px]:text-[11px]"
                  dangerouslySetInnerHTML={{ __html: i.bodyHtml }}
                />
                <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] text-[var(--exec-ink5)] mt-[3px]">{i.meta}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
