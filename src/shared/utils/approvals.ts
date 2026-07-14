import type { Role } from '@/shared/types'

/**
 * Section-135 approval workflow — exact port of the prototype's
 * getApprovalLevelForAmount / getApprovalLevelLabel / canApproveLevel.
 * Shared so the same rules drive Assessment, Notices, and Appeals.
 */
export type ApprovalLevel = 'auto' | 'L0' | 'L1' | 'L2'

const LEVEL_ORDER = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'] as const

/** Amount thresholds (in ₹) → who must sign off. */
export function getApprovalLevelForAmount(amount: number): ApprovalLevel {
  if (amount < 50_000) return 'auto' // L3/L4 finalize
  if (amount < 200_000) return 'L2' // SE
  if (amount < 1_000_000) return 'L1' // Chief Engineer
  return 'L0' // CMD / Director
}

const LEVEL_LABELS: Record<ApprovalLevel, string> = {
  auto: 'Auto-approve (below threshold)',
  L0: 'CMD / Director',
  L1: 'Chief Engineer',
  L2: 'Superintending Engineer',
}

export function getApprovalLevelLabel(level: ApprovalLevel): string {
  return LEVEL_LABELS[level] ?? level
}

/** Can this role approve at (or above) the given level? */
export function canApproveLevel(role: Role, level: ApprovalLevel): boolean {
  if (level === 'auto') return true
  const roleIdx = LEVEL_ORDER.indexOf(role.level as (typeof LEVEL_ORDER)[number])
  const lvlIdx = LEVEL_ORDER.indexOf(level)
  if (roleIdx === -1 || lvlIdx === -1) return false
  return roleIdx <= lvlIdx
}
