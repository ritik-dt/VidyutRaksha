import { fmtINR } from '@/shared/utils/formatters'
import type { Role } from '@/shared/types'
import type { ApprovalLevel } from '@/shared/utils/approvals'

interface ApprovalWorkflowGateProps {
  amount: number
  role: Role
  approvalLevel: ApprovalLevel
  approvalLabel: string
  canApprove: boolean
  isAutoApproved: boolean
  onPreviewPdf: () => void
  onGenerateNotice: () => void
  onSaveDraft: () => void
  onSubmitForApproval: () => void
  onReject: () => void
  onApprove: () => void
}

/**
 * Approval workflow gate — port of the prototype's 3-branch role-aware bar.
 * Below ₹50k → auto-approved; otherwise the box shape/copy/actions depend on
 * whether the current role can sign off at `approvalLevel`.
 */
export function ApprovalWorkflowGate({
  amount,
  role,
  approvalLabel,
  canApprove,
  isAutoApproved,
  onPreviewPdf,
  onGenerateNotice,
  onSaveDraft,
  onSubmitForApproval,
  onReject,
  onApprove,
}: ApprovalWorkflowGateProps) {
  /* ─── Auto-approved (< ₹50k) ──────────────────────────────────────────── */
  if (isAutoApproved) {
    return (
      <div
        className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-lg px-3.5 py-3"
        style={{ background: 'var(--ai-purple-light)' }}
      >
        <div className="text-[12px] text-ai-purple">
          <strong>Ready to generate assessment order</strong>
          <br />
          <span className="text-[10px]">
            Auto-approved (below ₹50,000 threshold) · All evidence attached
          </span>
        </div>
        <div className="flex gap-1.5 max-sm:w-full">
          <button
            type="button"
            className="btn btn-outline btn-sm max-sm:flex-1"
            onClick={onPreviewPdf}
          >
            📄 Preview PDF
          </button>
          <button
            type="button"
            className="btn btn-ai btn-sm max-sm:flex-1"
            onClick={onGenerateNotice}
          >
            ✦ Generate &amp; send notice
          </button>
        </div>
      </div>
    )
  }

  /* ─── Cannot approve — pending higher-level review ────────────────────── */
  if (!canApprove) {
    return (
      <div
        className="mt-3.5 rounded-lg p-3.5"
        style={{
          background: 'rgba(230,146,30,0.06)',
          border: '1px solid rgba(230,146,30,0.25)',
        }}
      >
        <div className="flex items-start gap-2.5">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[16px] text-white"
            style={{ background: 'var(--amber)' }}
          >
            ⏳
          </div>
          <div className="flex-1">
            <div
              className="text-[13px] font-bold"
              style={{ color: 'var(--amber-dark, #92400e)' }}
            >
              Pending {approvalLabel} approval — {approvalLabel}
            </div>
            <div className="mt-1 text-[11.5px] leading-[1.5] text-text-mid">
              Assessment of <strong>{fmtINR(amount)}</strong> exceeds your role's auto-approval
              threshold. {role.label} ({role.level}) can prepare and submit, but final sign-off
              must come from {approvalLabel}. Submit for approval — they'll be notified via in-app
              + email.
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onSaveDraft}
              >
                💾 Save draft
              </button>
              <button
                type="button"
                className="btn btn-ai btn-sm"
                onClick={onSubmitForApproval}
              >
                📤 Submit for {approvalLabel} approval
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Can approve — role has authority ────────────────────────────────── */
  return (
    <div
      className="mt-3.5 rounded-lg p-3.5"
      style={{
        background: 'rgba(40,167,69,0.05)',
        border: '1px solid rgba(40,167,69,0.25)',
      }}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[16px] text-white"
          style={{ background: 'var(--ai-gradient)' }}
        >
          ✓
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold" style={{ color: 'var(--green)' }}>
            Approval authority — {role.label} ({role.level})
          </div>
          <div className="mt-1 text-[11.5px] leading-[1.5] text-text-mid">
            Assessment of <strong>{fmtINR(amount)}</strong> requires{' '}
            <strong>{role.label}</strong> sign-off — that's you. Review the calculation, evidence,
            and legal basis above. Approval will trigger automatic notice generation and dispatch.
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: 'rgba(220,53,69,0.3)',
                color: 'var(--red)',
              }}
              onClick={onReject}
            >
              ✗ Reject with comments
            </button>
            <button type="button" className="btn btn-ai btn-sm" onClick={onApprove}>
              ✓ Approve &amp; dispatch notice
            </button>
            <span className="ml-auto text-[10px] text-text-dim max-sm:ml-0">
              Approval logged in audit trail
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
