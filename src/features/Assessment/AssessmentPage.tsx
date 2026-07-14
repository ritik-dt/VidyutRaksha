import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopePill } from '@/shared/components/ui/ScopePill'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/shared/utils/formatters'
import { useAssessment } from './hooks/useAssessment'
import { AssessmentKpiStrip } from './components/AssessmentKpiStrip'
import { InputParametersCard } from './components/InputParametersCard'
import { CalculationStepsCard } from './components/CalculationStepsCard'
import { MethodComparisonTable } from './components/MethodComparisonTable'
import { EvidencePackageCard } from './components/EvidencePackageCard'
import { ApprovalWorkflowGate } from './components/ApprovalWorkflowGate'
import {
  ASSESSMENT_CASE_ID,
  SAVED_DRAFTS_COUNT,
} from './data/assessment'

function ApprovalBadge({
  isAuto,
  canApprove,
  level,
}: {
  isAuto: boolean
  canApprove: boolean
  level: string
}) {
  if (isAuto) {
    return (
      <span
        className="inline-block whitespace-nowrap rounded-[14px] px-2.5 py-1 text-[10px] font-bold"
        style={{
          background: 'rgba(40,167,69,0.1)',
          color: 'var(--green)',
          border: '1px solid rgba(40,167,69,0.3)',
        }}
      >
        ✓ AUTO-APPROVE TIER
      </span>
    )
  }
  if (canApprove) {
    return (
      <span
        className="inline-block whitespace-nowrap rounded-[14px] px-2.5 py-1 text-[10px] font-bold"
        style={{
          background: 'rgba(40,167,69,0.1)',
          color: 'var(--green)',
          border: '1px solid rgba(40,167,69,0.3)',
        }}
      >
        ✓ YOU CAN APPROVE
      </span>
    )
  }
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[14px] px-2.5 py-1 text-[10px] font-bold"
      style={{
        background: 'rgba(230,146,30,0.1)',
        color: 'var(--amber-dark, #92400e)',
        border: '1px solid rgba(230,146,30,0.3)',
      }}
    >
      ⏳ NEEDS {level} APPROVAL
    </span>
  )
}

export default function AssessmentPage() {
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const {
    inputs,
    update,
    recalculate,
    breakdown,
    periodSub,
    currentRole,
    approvalLevel,
    approvalLabel,
    canApprove,
    isAutoApproved,
  } = useAssessment()

  function handleRecalculate() {
    const next = recalculate()
    showToast({
      type: 'ai',
      title: 'Assessment recalculated',
      message: `Total assessment: ${fmtINR(next.total)} (${next.days} days × ${inputs.peerAvgKwhPerDay} kWh/day × ₹${inputs.tariffRate.toFixed(2)} × ${next.penaltyMultiplier.toFixed(1)}x).`,
      duration: 4000,
    })
  }
  function handleSaveDraft() {
    showToast({
      type: 'info',
      title: 'Saved as draft',
      message: `Assessment saved. Submit when ready for ${approvalLabel} review.`,
      duration: 3000,
    })
  }
  function handlePreviewPdf() {
    showToast({ type: 'info', title: 'Preview generated', message: 'Opening PDF preview...', duration: 2500 })
  }
  function handleGenerateNotice() {
    showToast({
      type: 'success',
      title: 'Assessment notice generated',
      message: 'PDF auto-signed and queued for delivery.',
      duration: 4500,
    })
  }
  function handleSubmitForApproval() {
    showToast({
      type: 'success',
      title: 'Submitted for approval',
      message: `Sent to ${approvalLabel}. Notification dispatched. You will be notified when reviewed.`,
      duration: 5000,
    })
    logActivity('Submitted assessment for approval', 'assessment', approvalLabel)
  }
  function handleReject() {
    showToast({
      type: 'warning',
      title: 'Assessment rejected',
      message: 'Returned to preparer with comments. They will revise and resubmit.',
      duration: 4000,
    })
  }
  function handleApprove() {
    showToast({
      type: 'success',
      title: '✓ Approved & dispatched',
      message: `Assessment notice signed by ${currentRole.label}. PDF generated, dispatched to consumer via registered post + SMS.`,
      duration: 5500,
    })
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="💰 Assessment calculator"
        subtitle="Calculate Section 135 assessment with full audit trail — legally admissible math"
        actions={
          <>
            <ApprovalBadge isAuto={isAutoApproved} canApprove={canApprove} level={approvalLevel} />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Load from case',
                  message: 'Select a confirmed case to pre-fill the calculator inputs.',
                  duration: 3000,
                })
              }
            >
              📋 Load from case
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: `Saved drafts (${SAVED_DRAFTS_COUNT})`,
                  message: 'Resume a saved assessment draft from your queue.',
                  duration: 3000,
                })
              }
            >
              📄 Saved drafts ({SAVED_DRAFTS_COUNT})
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI auto-calculate',
                  message: 'AI is inferring peer baseline, tariff, and multiplier for this case.',
                  duration: 3500,
                })
              }
            >
              ✦ AI auto-calculate
            </button>
          </>
        }
      />

      <ScopePill />

      <AiInsightBanner title="AI assessment guidance">
        This calculator implements{' '}
        <strong className="text-ai-purple">Section 135 of Electricity Act 2003</strong> +{' '}
        <strong className="text-ai-purple">UPERC regulations</strong> for assessment of theft cases.
        Pre-filled values below are from{' '}
        <strong className="text-ai-purple">
          Case {ASSESSMENT_CASE_ID} ({inputs.consumer}, Meter #1849966)
        </strong>
        . The calculation uses{' '}
        <strong className="text-ai-purple">peer-group consumption baseline</strong> to estimate
        stolen energy over the theft period.{' '}
        <strong className="text-ai-purple">
          All intermediate values are shown and exportable for court admissibility.
        </strong>
      </AiInsightBanner>

      <AssessmentKpiStrip breakdown={breakdown} inputs={inputs} periodSub={periodSub} />

      <div className="grid-2 mb-3.5 gap-3.5">
        <InputParametersCard
          inputs={inputs}
          onChange={update}
          onRecalculate={handleRecalculate}
          onSaveDraft={handleSaveDraft}
        />
        <CalculationStepsCard inputs={inputs} breakdown={breakdown} />
      </div>

      <MethodComparisonTable
        onSelectMethod={(m) =>
          showToast({
            type: 'success',
            title: `${m.name.replace(/^✓ /, '').replace(/ \(RECOMMENDED\)$/, '')} selected`,
            message: `Assessment method updated to ${m.name.toLowerCase()}. New penalty total: ${fmtINR(m.withPenalty)}.`,
            duration: 3500,
          })
        }
      />

      <EvidencePackageCard />

      <ApprovalWorkflowGate
        amount={breakdown.total}
        role={currentRole}
        approvalLevel={approvalLevel}
        approvalLabel={approvalLabel}
        canApprove={canApprove}
        isAutoApproved={isAutoApproved}
        onPreviewPdf={handlePreviewPdf}
        onGenerateNotice={handleGenerateNotice}
        onSaveDraft={handleSaveDraft}
        onSubmitForApproval={handleSubmitForApproval}
        onReject={handleReject}
        onApprove={handleApprove}
      />
    </div>
  )
}
