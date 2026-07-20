import type { BenefitCard } from '../types'

interface NonFinancialGridProps {
  benefits: BenefitCard[]
}

/**
 * 6 non-financial value cards in a 3-col grid.
 *   Layout: icon (22px, left) + body (title uppercase + purple value + description).
 * Responsive: 3-col → 2-col at ≤900px → 1-col at ≤640px.
 * `.roi-benefit` had `padding:14px` (LESS than `.card`'s 18px). Add `!p-[14px]`.
 */
export function NonFinancialGrid({ benefits }: NonFinancialGridProps) {
  return (
    <div className="grid grid-cols-3 gap-[14px] mb-[14px] max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[480px]:gap-[10px]">
      {benefits.map((b) => (
        <div key={b.id} className="card !p-[14px] !m-0 min-w-0">
          <div className="flex items-start gap-[9px]">
            <span className="text-[22px] shrink-0 max-[480px]:text-[20px]">{b.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-[0.4px] break-words">
                {b.title}
              </div>
              <div className="text-[16px] font-extrabold text-[var(--ai-purple)] font-['JetBrains_Mono',_ui-monospace,_monospace] mt-[2px] leading-[1.1] break-words max-[480px]:text-[15px]">
                {b.value}
              </div>
              <div className="text-[10.5px] text-[var(--text-mid)] mt-[5px] leading-[1.5] break-words">
                {b.desc}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
