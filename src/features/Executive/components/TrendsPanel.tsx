import type { DetailPanelKey, TrendChart } from '../types'

interface TrendsPanelProps {
  trends: TrendChart[]
  onOpenPanel: (key: DetailPanelKey) => void
}

function toneColor(tone?: string): string {
  switch (tone) {
    case 'jade':    return 'var(--exec-jade)'
    case 'amber':   return 'var(--exec-amber)'
    case 'crimson': return 'var(--exec-crimson)'
    case 'brand':   return 'var(--exec-brand)'
    default:        return 'var(--exec-ink3)'
  }
}

/** Sparkline SVG — 200×50 with gradient area fill. */
function Sparkline({ points, color, id }: { points: number[]; color: string; id: string }) {
  const w = 200, h = 50
  const stepX = w / (points.length - 1)
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * stepX).toFixed(1)},${y}`).join(' ')
  const areaPath = `${path} L${w},${h} L0,${h} Z`
  const gradId = `spark-${id}`
  return (
    <svg className="w-full h-[50px] block" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={areaPath} fill={`url(#${gradId})`} />
      <text x="0"   y="48" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="var(--exec-ink5)">D-7</text>
      <text x="175" y="48" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="var(--exec-ink5)">Today</text>
    </svg>
  )
}

/** 📈 7-Day Trends — 3-col sparkline grid (AT&C Loss, Peak Demand, Revenue Collection). */
export function TrendsPanel({ trends, onOpenPanel }: TrendsPanelProps) {
  return (
    <section className="h-full bg-[var(--exec-surface)] border border-[var(--exec-border)] rounded-[14px] py-[16px] px-[18px] relative overflow-hidden shadow-[var(--exec-shadow-xs)] flex flex-col hover:shadow-[var(--exec-shadow-sm)] max-[640px]:py-[13px] max-[640px]:px-[15px] max-[480px]:py-[11px] max-[480px]:px-[12px] max-[480px]:rounded-[12px]">
      <h3 className="font-['Syne',_serif] text-[14px] font-bold text-[var(--exec-ink)] mb-[12px] flex items-center gap-[8px] flex-wrap max-[640px]:text-[13px] max-[640px]:mb-[10px] max-[480px]:text-[12.5px]">
        📈 7-Day <em style={{ fontStyle: 'italic', color: 'var(--exec-brand)', fontWeight: 400 }}>Trends</em>
      </h3>
      <div className="grid grid-cols-3 gap-[12px] max-[1200px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-[10px]">
        {trends.map((t) => (
          <div
            key={t.id}
            className="cursor-pointer min-w-0"
            onClick={() => onOpenPanel(t.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="text-[11.5px] font-semibold text-[var(--exec-ink2)] mb-[8px] flex justify-between items-center gap-[6px] flex-wrap">
              <span>{t.title}</span>
              <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[11px]" style={{ color: toneColor(t.valueTone) }}>
                {t.valueText}
              </span>
            </div>
            <Sparkline points={t.points} color={t.color} id={t.id} />
            <div className="flex justify-between mt-[3px] font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] text-[var(--exec-ink4)] gap-[4px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {t.labels.map((l, i) => (
                <span
                  key={l + i}
                  className="shrink-0"
                  style={i === t.labels.length - 1 ? { color: toneColor(t.finalTone), fontWeight: 600 } : undefined}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
