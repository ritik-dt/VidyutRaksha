import type { OpportunityCard } from '../types'

interface OpportunityCardsProps {
  cards: OpportunityCard[]
}

/** Gradient-tinted background + border for each severity tint. */
function tintStyles(tint: string): { bg: string; border: string } {
  switch (tint) {
    case 'red':
      return {
        bg: 'linear-gradient(135deg, rgba(220,53,69,0.04) 0%, rgba(220,53,69,0.01) 100%)',
        border: 'rgba(220,53,69,0.15)',
      }
    case 'amber':
      return {
        bg: 'linear-gradient(135deg, rgba(230,146,30,0.04) 0%, rgba(230,146,30,0.01) 100%)',
        border: 'rgba(230,146,30,0.15)',
      }
    default:
      return { bg: 'var(--card)', border: 'var(--border)' }
  }
}

/** Value colour based on tone (was `.roi-val-ink/red/amber`). */
function valueColor(tone: string): string {
  switch (tone) {
    case 'red':   return 'var(--red)'
    case 'amber': return 'var(--amber-dark)'
    default:      return 'var(--text)'
  }
}

/**
 * 4 severity-tinted KPI cards under "The opportunity".
 * Responsive: 4-col → 2-col at ≤900px → 1-col at ≤480px.
 * `!p-0` isn't needed here since `.roi-opp-card` explicitly used `padding:16px`
 * (LESS than `.card`'s 18px). We add `!p-[16px]` to defeat the shared padding.
 */
export function OpportunityCards({ cards }: OpportunityCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-[14px] mb-[14px] max-[900px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-[10px]">
      {cards.map((c) => {
        const t = tintStyles(c.tint)
        return (
          <div
            key={c.id}
            className="card !p-[16px] !m-0 min-w-0"
            style={{ background: t.bg, borderColor: t.border }}
          >
            <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-[0.4px] break-words">
              {c.label}
            </div>
            <div
              className="text-[22px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] mt-[4px] break-words max-[480px]:text-[20px]"
              style={{ color: valueColor(c.valueTone) }}
            >
              {c.value}
            </div>
            <div
              className="text-[10px] text-[var(--text-mid)] mt-[2px] [&_strong]:text-[var(--text)] break-words"
              dangerouslySetInnerHTML={{ __html: c.subHtml }}
            />
          </div>
        )
      })}
    </div>
  )
}
