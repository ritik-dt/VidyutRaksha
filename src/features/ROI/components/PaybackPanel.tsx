import type { CumulativeNetComputed } from '../logic/cumulativeNet'
import type { PaybackStat } from '../types'

interface PaybackPanelProps {
  stats: PaybackStat[]
  cumulativeNet: CumulativeNetComputed[]
}

/** Tone → tile bg + border + label/value colour. */
function tileStyles(tone: string): { bg: string; border: string; accent: string } {
  switch (tone) {
    case 'green':  return { bg: 'rgba(40,167,69,0.06)',  border: 'rgba(40,167,69,0.25)',  accent: 'var(--green)' }
    case 'purple': return { bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.25)', accent: 'var(--ai-purple)' }
    default:       return { bg: 'var(--bg)',              border: 'var(--border)',         accent: 'var(--text)' }
  }
}

/**
 * Payback & NPV panel:
 *   • Top: 4 stat tiles in 2×2 grid (Year 1 + Steady-state = green,
 *     Payback + ROI multiple = purple)
 *   • Bottom: 5-year cumulative-net bar chart with green gradient bars
 *     laid out as a 3-column mini-grid (year label · bar · value)
 *
 * Responsive: tiles stack to 1-col at ≤380px.
 */
export function PaybackPanel({ stats, cumulativeNet }: PaybackPanelProps) {
  return (
    <div className="card">
      <div className="card-title">Payback &amp; NPV (base case)</div>

      {/* Payback tiles */}
      <div className="grid grid-cols-2 gap-[8px] mt-[10px] max-[380px]:grid-cols-1">
        {stats.map((s) => {
          const st = tileStyles(s.tone)
          return (
            <div
              key={s.id}
              className="py-[11px] px-[11px] rounded-[7px] min-w-0 border"
              style={{ background: st.bg, borderColor: st.border }}
            >
              <div
                className="text-[9.5px] font-bold uppercase tracking-[0.3px] break-words"
                style={{ color: st.accent }}
              >
                {s.label}
              </div>
              <div
                className="text-[20px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] mt-[2px] break-words max-[480px]:text-[18px]"
                style={{ color: st.accent }}
              >
                {s.value}
              </div>
              <div className="text-[10px] text-[var(--text-mid)] mt-[1px] break-words">
                {s.sub}
              </div>
            </div>
          )
        })}
      </div>

      {/* 5-year cumulative net bars */}
      <div className="mt-[12px]">
        <div className="text-[9.5px] text-[var(--text-dim)] font-bold uppercase tracking-[0.3px] mb-[6px]">
          5-year cumulative net (₹ Cr)
        </div>
        {cumulativeNet.map((r) => (
          <div
            key={r.year}
            className="grid grid-cols-[38px_1fr_70px] items-center gap-[8px] mb-[5px] max-[480px]:grid-cols-[32px_1fr_62px] max-[480px]:gap-[6px]"
          >
            <div className="text-[10.5px] font-bold text-[var(--text)]">{r.year}</div>
            <div className="h-[14px] bg-[var(--bg)] rounded-[4px] overflow-hidden">
              <div
                className="h-full max-w-full transition-[width_0.3s] [background:linear-gradient(90deg,_var(--green)_0%,_#5BC97A_100%)]"
                style={{ width: `${r.widthPct}%` }}
              />
            </div>
            <div className="text-right font-['JetBrains_Mono',_ui-monospace,_monospace] font-bold text-[var(--green)] text-[11px] whitespace-nowrap">
              {r.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
