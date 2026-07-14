import type { BenefitCard } from '../types'

interface NonFinancialGridProps {
  benefits: BenefitCard[]
}

/** 6 non-financial value cards in a 3-col grid. */
export function NonFinancialGrid({ benefits }: NonFinancialGridProps) {
  return (
    <div className="grid-3" style={{ marginBottom: 14 }}>
      {benefits.map((b) => (
        <div key={b.id} className="card roi-benefit">
          <div className="roi-benefit-inner">
            <span className="roi-benefit-icon">{b.icon}</span>
            <div className="roi-benefit-body">
              <div className="roi-benefit-title">{b.title}</div>
              <div className="roi-benefit-value">{b.value}</div>
              <div className="roi-benefit-desc">{b.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
