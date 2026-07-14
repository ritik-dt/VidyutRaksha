import type { OpportunityCard } from '../types'

interface OpportunityCardsProps {
  cards: OpportunityCard[]
}

/** 4 severity-tinted KPI cards under "The opportunity". */
export function OpportunityCards({ cards }: OpportunityCardsProps) {
  return (
    <div className="grid-4" style={{ marginBottom: 14 }}>
      {cards.map((c) => (
        <div key={c.id} className={`card roi-opp-card roi-tint-${c.tint}`}>
          <div className="roi-opp-label">{c.label}</div>
          <div className={`roi-opp-value roi-val-${c.valueTone}`}>{c.value}</div>
          <div
            className="roi-opp-sub"
            dangerouslySetInnerHTML={{ __html: c.subHtml }}
          />
        </div>
      ))}
    </div>
  )
}
