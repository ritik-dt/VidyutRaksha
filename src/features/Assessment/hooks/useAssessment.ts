import { useMemo, useState } from 'react'
import { useRole } from '@/shared/context/RoleContext'
import {
  canApproveLevel,
  getApprovalLevelForAmount,
  getApprovalLevelLabel,
} from '@/shared/utils/approvals'
import {
  DEFAULT_BREAKDOWN,
  DEFAULT_INPUTS,
  DEFAULT_PERIOD_SUB,
  calculateAssessment,
} from '../data/assessment'
import type { AssessmentBreakdown, AssessmentInputs } from '../types'

/** Short month + year label for the "Theft period" KPI sub. */
function formatPeriodSub(inputs: AssessmentInputs): string {
  const s = new Date(inputs.theftStartDate)
  const e = new Date(inputs.detectionDate)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return DEFAULT_PERIOD_SUB
  const opts: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' }
  return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}`
}

/**
 * Assessment state — controlled form with live recalculation on every input
 * change (matches the prototype's real-time behavior). On first load, the
 * hardcoded prototype values are shown (1,350 days / ₹3,88,800). As soon as
 * the user edits any field, live math from calculateAssessment takes over.
 */
export function useAssessment() {
  const { currentRole } = useRole()
  const [inputs, setInputs] = useState<AssessmentInputs>(DEFAULT_INPUTS)
  const [isDirty, setIsDirty] = useState(false)

  // Show prototype's exact numbers until the user edits anything; then live math.
  const breakdown = useMemo<AssessmentBreakdown>(
    () => (isDirty ? calculateAssessment(inputs) : DEFAULT_BREAKDOWN),
    [inputs, isDirty],
  )
  const periodSub = useMemo(
    () => (isDirty ? formatPeriodSub(inputs) : DEFAULT_PERIOD_SUB),
    [inputs, isDirty],
  )

  const approvalLevel = useMemo(() => getApprovalLevelForAmount(breakdown.total), [breakdown.total])
  const approvalLabel = getApprovalLevelLabel(approvalLevel)
  const canApprove = canApproveLevel(currentRole, approvalLevel)
  const isAutoApproved = approvalLevel === 'auto'

  function update<K extends keyof AssessmentInputs>(key: K, value: AssessmentInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true) // → switches breakdown/periodSub to live math immediately
  }

  /** Explicit Recalculate — the button in the input card. Returns the current
   *  live breakdown so the page can toast the fresh totals. */
  function recalculate(): AssessmentBreakdown {
    const next = calculateAssessment(inputs)
    setIsDirty(true)
    return next
  }

  function reset() {
    setInputs(DEFAULT_INPUTS)
    setIsDirty(false)
  }

  return {
    inputs,
    update,
    reset,
    recalculate,
    breakdown,
    periodSub,
    isDirty,
    currentRole,
    approvalLevel,
    approvalLabel,
    canApprove,
    isAutoApproved,
  }
}
