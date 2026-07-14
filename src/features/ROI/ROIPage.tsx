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
 */
export default function ROIPage() {
  const roi = useRoi()
  const { showToast } = useToast()

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="💼 ROI & Business Case"
        subtitle="Financial case for state-wide rollout · UPPCL · 15-lakh smart-meter footprint"
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

      {/* Procurement-grade anchor line */}
      <div className="roi-anchor-line">
        <div className="roi-grade">
          <span className="roi-grade-dot" />
          <strong className="roi-grade-text">PROCUREMENT GRADE</strong>
        </div>
        <span className="roi-anchor-sep">·</span>
        <span>
          Anchors: <strong>UPPCL AT&amp;C Tariff Order FY26</strong> ·{' '}
          <strong>PFC RDSS guidelines</strong> · <strong>CEA loss-bracket data</strong>
        </span>
      </div>

      {/* Section 1 · The opportunity */}
      <RoiSectionHeader color="var(--red)" label="1 · The opportunity (loss baseline)" />
      <OpportunityCards cards={roi.opportunityCards} />
      <LossBreakdownTable buckets={roi.lossBuckets} total={roi.lossTotal} />

      {/* Section 2 · AI-attributable recovery */}
      <RoiSectionHeader color="var(--ai-purple)" label="2 · AI-attributable recovery (3 scenarios)" />
      <RecoveryScenarios scenarios={roi.scenarios} />

      {/* Section 3 · Implementation cost & payback */}
      <RoiSectionHeader color="var(--green)" label="3 · Implementation cost & payback" />
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <CostStackTable rows={roi.costRows} total={roi.costTotal} note={roi.costNote} />
        <PaybackPanel stats={roi.paybackStats} cumulativeNet={roi.cumulativeNet} />
      </div>

      {/* Section 4 · Non-financial value */}
      <RoiSectionHeader color="#0EA5E9" label="4 · Non-financial value" />
      <NonFinancialGrid benefits={roi.benefits} />

      {/* Section 5 · What could go wrong */}
      <RoiSectionHeader color="var(--amber)" label="5 · What could go wrong" />
      <RiskTable risks={roi.risks} />

      {/* Section 6 · Recommendation */}
      <RecommendationCard
        recommendation={roi.recommendation}
        onLockScope={() => showToast(roi.toasts.lockScope)}
        onSendBoard={() => showToast(roi.toasts.sendBoard)}
      />
    </div>
  )
}
