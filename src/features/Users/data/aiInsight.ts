import type { UsersAiInsight } from '../types'

/** AI access-review banner. */
export const USERS_AI_INSIGHT: UsersAiInsight = {
  title: '✦ AI access review',
  bodyHtml:
    '<strong>17 active users</strong> across 5 role types. <strong>Vikram Yadav has been inactive for 7 days</strong> but still has 31 open cases assigned — recommend reassignment. <strong>2 users have Admin role</strong> (within safe limits; industry best practice is ≤3). <strong>No permission anomalies detected</strong> in the last 30 days. <strong>SSO integration:</strong> 14 of 17 users authenticate via UPPCL Active Directory; 3 use local accounts (migrate to SSO recommended).',
}
