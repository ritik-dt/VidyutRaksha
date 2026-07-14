import type { RoleId } from '@/shared/types/role'

/**
 * The AI insight body varies by role — the prototype branches on role.id with a
 * dedicated line for CMD, AEN and Analyst, and a generic fallback for the rest
 * (chief, se, ee).
 */
const ROLE_LINE: Partial<Record<RoleId, string>> = {
  cmd: '<strong>CMD defaults to email digests</strong> — morning summaries instead of real-time pings.',
  aen: '<strong>AEN gets SMS for everything urgent</strong> — field-first, not desk-first. In-app + SMS for high-risk and SLA.',
  analyst:
    '<strong>Analyst defaults to digest mode</strong> — reports are your primary channel; real-time alerts off.',
}

const FALLBACK_LINE = 'Real-time channels enabled for actionable alerts. Adjust below as needed.'

/** Build the insight body for a role. */
export function settingsInsightHtml(roleId: RoleId): string {
  const line = ROLE_LINE[roleId] ?? FALLBACK_LINE
  return `Based on your role, I have pre-configured notifications to match your typical workflow. ${line} You can change anything below; defaults can be restored anytime.`
}
