import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useToast } from '@/shared/context/ToastContext'
import { CostStackTable } from './components/CostStackTable'
import { LossBreakdownTable } from './components/LossBreakdownTable'
import { NonFinancialGrid } from './components/NonFinancialGrid'
import { OpportunityCards } from './components/OpportunityCards'
import { PaybackPanel } from './components/PaybackPanel'
import { RecommendationCard } from './components/RecommendationCard'
import { RecoveryScenarios } from './components/RecoveryScenarios'
import { RiskTable } from './components/RiskTable'
import { RoiSectionHeader } from './components/RoiSectionHeader'
import { useRoi } from './hooks/useRoi'

/**
 * ROI & Business Case — faithful port of the prototype's renderROI().
 * A procurement-grade, long-form financial business case. State-level and NOT
 * scope-reactive (matches the prototype, which computes scope values but
 * discards them). Every panel is prop-driven from useRoi; the hook is the sole
 * API-integration seam.
 *
 * Responsive strategy:
 *   • Anchor line wraps to multiple lines on narrow screens.
 *   • Sections 1-2 & 4-5 use their component-level grid responsiveness.
 *   • Section 3 is a 2-col grid (CostStackTable + PaybackPanel) that
 *     collapses to 1-col at ≤900px.
 */
export default function ROIPage() {
  const roi = useRoi()
  const { showToast } = useToast()

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="💼 ROI & Business Case"
        subtitle={
          <>
            Financial case for state-wide rollout · UPPCL · 15-lakh smart-meter footprint
            <span className="flex items-center gap-[8px] mt-[6px] text-[10.5px] text-[var(--text-mid)] flex-wrap [&_strong]:text-[var(--text)]">
              <span className="flex items-center gap-[5px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--ai-purple)]" />
                <strong className="!text-[var(--ai-purple)] font-bold">
                  PROCUREMENT GRADE
                </strong>
              </span>
              <span className="text-[var(--text-dim)]">·</span>
              <span>
                Anchors: <strong>UPPCL AT&amp;C Tariff Order FY26</strong> ·{' '}
                <strong>PFC RDSS guidelines</strong> ·{' '}
                <strong>CEA loss-bracket data</strong>
              </span>
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => showToast(roi.toasts.exportModel)}
            >
              📊 Export model
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => showToast(roi.toasts.draftTender)}
            >
              ✦ Draft tender response
            </button>
          </>
        }
      />

      {/* Section 1 · The opportunity */}
      <RoiSectionHeader color="var(--red)" label="1 · The opportunity (loss baseline)" />
      <OpportunityCards cards={roi.opportunityCards} />
      <LossBreakdownTable buckets={roi.lossBuckets} total={roi.lossTotal} />

      {/* Section 2 · AI-attributable recovery */}
      <RoiSectionHeader
        color="var(--ai-purple)"
        label="2 · AI-attributable recovery (3 scenarios)"
      />
      <RecoveryScenarios scenarios={roi.scenarios} />

      {/* Section 3 · Implementation cost & payback.
          Prototype: `grid-template-columns: 1.4fr 1fr` on desktop.
          Responsive: collapse to 1-col at ≤900px. */}
      <RoiSectionHeader color="var(--green)" label="3 · Implementation cost & payback" />
      <div className="grid grid-cols-[1.4fr_1fr] gap-[14px] mb-[14px] max-[900px]:grid-cols-1 max-[480px]:gap-[10px]">
        <div className="min-w-0">
          <CostStackTable rows={roi.costRows} total={roi.costTotal} note={roi.costNote} />
        </div>
        <div className="min-w-0">
          <PaybackPanel stats={roi.paybackStats} cumulativeNet={roi.cumulativeNet} />
        </div>
      </div>

      {/* Section 4 · Non-financial value */}
      <RoiSectionHeader color="#0EA5E9" label="4 · Non-financial value" />
      <NonFinancialGrid benefits={roi.benefits} />

      {/* Section 5 · What could go wrong */}
      <RoiSectionHeader color="var(--amber)" label="5 · What could go wrong" />
      <RiskTable risks={roi.risks} />

      {/* Section 6 · Recommendation (no header — the card is the header). */}
      <RecommendationCard
        recommendation={roi.recommendation}
        onLockScope={() => showToast(roi.toasts.lockScope)}
        onSendBoard={() => showToast(roi.toasts.sendBoard)}
      />
    </div>
  )
}
