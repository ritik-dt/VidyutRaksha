/**
 * dashboardAdapter — hierarchy-aware view models derived from prototype renderDashboard.
 */
import type { HierChildRef, HierNode, HierNodeType } from '@/types'
import type { RoleId } from '@/types/role'
import { formatIndian } from '@/utils/formatters'
import type {
  EnrichedChildRef,
  EnrichedLevel,
  HotspotItem,
  MainKpiCard,
  OvernightDelta,
  QueueItem,
} from './types'
import type { ScreenName } from '@/types'

export const HIER_AI: Record<string, string> = {
  uppcl:
    'Across 15 lakh consumers, <strong>KVVNL (Kashi)</strong> has the highest flag rate at 2.88%. <strong>PUVVNL (Purvanchal)</strong> has the best hit rate at 63.4% — their field teams are most effective. DVVNL has the highest AT&C loss at 22.6% — recommend priority focus.',
  kvvnl:
    'Within KVVNL, <strong>Varanasi Zone</strong> has the highest losses at 22.4%. The gap is concentrated in EUDC I — specifically Bhelupur Division. Azamgarh and Jaunpur are performing closer to target.',
  pvvnl:
    'PVVNL covers Western UP with 3.8L consumers. <strong>Agra Zone</strong> has the highest losses at 19.2%. Meerut is performing well at 17.8%. Overall hit rate of 56.1% — room for improvement.',
  mvvnl:
    'MVVNL covers Central UP. <strong>Kanpur Zone</strong> has higher losses (19.8%) than Lucknow (18.6%). Both zones have similar hit rates (~57%). Recommend cross-zone best-practice sharing.',
  dvvnl:
    'DVVNL has the <strong>highest AT&C losses across UPPCL at 22.6%</strong>. Prayagraj Zone is the primary contributor at 23.1%. Hit rate is the lowest at 53.6% — inspector training recommended.',
  puvvnl:
    'PUVVNL has the <strong>best hit rate across UPPCL at 63.4%</strong>. Gorakhpur field teams are particularly effective (64.9%). Demonstrates that targeted inspections yield high confirmation rates.',
  varanasi:
    '<strong>EUDC I Varanasi</strong> has 23.1% AT&C loss — 1.9pp higher than EUDC II. The gap is concentrated in EUDD Bhelupur. Recommend shifting 2 inspection teams from EUDC II to EUDC I.',
  azamgarh:
    'EDC Azamgarh has slightly higher losses (21.2%) than EDC Mau (20.2%). Both are close to the zone average. Maintain current inspection cadence.',
  jaunpur:
    'EDC Jaunpur has higher losses at 21.8% with a good hit rate of 60%. Sultanpur is more moderate. Overall this zone is performing well within KVVNL.',
  eudc1:
    '<strong>EUDD Bhelupur</strong> leads with 24.1% losses but also the best hit rate (63.6%). The theft is real, not false positives. Prioritize field capacity here.',
  eudc2:
    'All three divisions are within 2pp of each other. Madhauli has the highest losses but Chetmani has the lowest hit rate — may need inspector training or rule tuning.',
  bhelupur:
    '<strong>EUDSD Bhelupur</strong> has 25.2% losses with a 66.7% hit rate — the strongest theft signal in the network. Focus resources on EUDSD Bhelupur feeders.',
  varunapar:
    'Both sub-divisions have similar loss profiles (~22-23%). EUDSD Varunapar has a slightly higher flag rate. Monitor for emerging patterns in Pandeypur area.',
  machchodari:
    'EUDSD Machchodari has higher losses than Sigra. The division overall is performing at 59.6% hit rate — solid performance.',
  chetmani:
    'Hit rate of 51.7% is the lowest in EUDC II. Either the rules need tuning for this area or the field teams need additional training.',
  madhauli:
    'Losses at 22.4% are the highest in EUDC II. Both sub-divisions contribute roughly equally. Recommend increasing inspection frequency.',
  sarnath:
    'EUDSD Sarnath has slightly higher losses than DPH. Overall moderate performance. Consider rule optimization for better targeting.',
  sd_bhelupur:
    '<strong>Rathayatra Feeder</strong> has the highest hit rate at 70%. Bhelupur Feeder has the highest loss at 26.8% — DTR Vijaya Complex is the primary contributor.',
  sd_badalalpur:
    'Central Jail Feeder has higher losses and more flags than Ramarepur. The area around Central Jail has historically higher theft rates.',
  f_bhelupur:
    '<strong>DTR Vijaya Complex</strong> has 28.4% losses with 9 flagged consumers out of 47 (19% flag rate vs 2.7% network average). 7x the normal rate — strong cluster signal.',
  f_rathayatra:
    'Two DTRs under this feeder. Tulsi Manas Mandir has 100% hit rate — every inspection finds theft. Both DTRs warrant continued attention.',
  f_raghunath:
    'Raghunath Nagar Colony DTR has 10 flagged consumers. <strong>M/S GUPTA TRADERS</strong> (risk 85) is a high-value commercial target with 55% drop and 28 tamper events.',
  dtr_vijaya:
    '9 consumers flagged out of 47. <strong>HEERA LAL AGRAWAL</strong> (risk 88) — 35 KW commercial with 52% drop and 32 tamper events. <strong>ANAND PRAKASH AGARWAL</strong> — Office on domestic tariff LMV1 — likely tariff misuse.',
  dtr_rath1:
    '<strong>RAMESH KUMAR</strong> (risk 74) shows a 42% consumption drop with 14 tamper events — pattern consistent with partial bypass.',
  dtr_rath2:
    'This DTR has a 100% inspection hit rate. <strong>VIJAY SHANKAR</strong> (risk 82) has 22 tamper events with 48% consumption drop — strong earth loading signal.',
  dtr_ragh1:
    '<strong>M/S GUPTA TRADERS</strong> (risk 85) — non-domestic consumer with 55% drop and 28 events — likely CT manipulation on 15 KW commercial load. High-value recovery target.',
}

const ROLE_INSIGHTS: Partial<
  Record<ScreenName, Partial<Record<RoleId, string>>>
> = {
  dashboard: {
    cmd: "Across UPPCL's <strong>15 lakh consumers</strong>, AT&C loss trajectory is on track for the <strong>18% FY26 target</strong>. KVVNL is performing strongest (-2.2pp YoY); Lucknow Zone needs attention (-0.4pp YoY). Today: <strong>851 new high-risk consumers flagged</strong>, ₹4.2L estimated daily loss exposure.",
    chief:
      'Varanasi Zone: AT&C at <strong>17.7%</strong>, ranked #5 nationally. <strong>Bhelupur Division</strong> leads improvement (-2.2pp). Today across your 3 divisions: <strong>847 high-risk flags</strong>, ~₹4.2L daily exposure. <strong>Sunita Verma\'s team</strong> overdue cases need attention.',
    se: 'Bhelupur Division: <strong>17.7% AT&C</strong>, improving. <strong>3 sub-divisions</strong> tracked, Bhelupur West has highest theft density. Today: <strong>342 new flags</strong> in your division. <strong>8 cases past SLA</strong> — recommend escalation review.',
    ee: 'Bhelupur West Sub-division: <strong>14 DTs</strong>, 1,116 consumers monitored. Today: <strong>108 new flags</strong>, 12 cases ready for inspection. <strong>DT-0445 at 94% loading</strong> — capacity action needed this week. Inspector workload balanced.',
    aen: 'Your 14 DTs: <strong>2 critical</strong> (DT-0445, DT-0312), 4 warning. Today: <strong>23 new high-risk flags</strong> across your DTs. <strong>3 inspections scheduled</strong> for tomorrow. Phase imbalance on DT-0445 is severe (14%) — needs site visit.',
    analyst:
      'Read-only view. Today\'s data: <strong>851 new flags</strong> across UPPCL, <strong>12,040 inspections</strong> FYTD, <strong>57% hit rate</strong>. <strong>3 cohort reports</strong> auto-generated overnight, available in Reports.',
  },
}

const CHILD_LABELS: Record<string, string> = {
  State: 'DISCOM',
  DISCOM: 'Zone',
  Zone: 'Circle',
  Circle: 'Division',
  Division: 'Sub-division',
  'Sub-division': 'Feeder',
  Feeder: 'DTR',
  DTR: 'Consumer',
}

export function getChildLabel(type: string | undefined): string {
  return CHILD_LABELS[type ?? ''] ?? 'Children'
}

export function fmtINR(amt?: number | null): string {
  if (amt == null || Number.isNaN(amt)) return '—'
  if (amt >= 10_000_000)
    return `₹${(amt / 10_000_000).toFixed(1).replace(/\.0$/, '')} Cr`
  if (amt >= 100_000)
    return `₹${(amt / 100_000).toFixed(1).replace(/\.0$/, '')} L`
  if (amt >= 1_000) return `₹${(amt / 1_000).toFixed(0)}K`
  return `₹${amt.toLocaleString('en-IN')}`
}

function enrichChild(child: HierChildRef): EnrichedChildRef {
  const enriched: EnrichedChildRef = { ...child }

  if (enriched.flagged != null) {
    if (enriched.critical == null)
      enriched.critical = Math.round(enriched.flagged * 0.12)
    if (enriched.high == null)
      enriched.high = Math.round(enriched.flagged * 0.33)
    if (enriched.medium == null)
      enriched.medium =
        enriched.flagged - (enriched.critical ?? 0) - (enriched.high ?? 0)
    if (enriched.openCases == null)
      enriched.openCases = Math.round(enriched.flagged * 0.18)
    if (enriched.newToday == null)
      enriched.newToday = Math.round(enriched.flagged * 0.021)
    if (enriched.overdueInspections == null)
      enriched.overdueInspections = Math.round(enriched.flagged * 0.018)
  }

  if (enriched.confirmed != null) {
    if (enriched.assessed == null)
      enriched.assessed = enriched.confirmed * 600_000
    if (enriched.realized == null)
      enriched.realized = Math.round((enriched.assessed ?? 0) * 0.62)
    if (enriched.closedYesterday == null)
      enriched.closedYesterday = Math.max(
        0,
        Math.round(enriched.confirmed * 0.014),
      )
  }

  return enriched
}

export function enrichLevel(level: HierNode): EnrichedLevel {
  const enriched: EnrichedLevel = { ...level }

  if (enriched.flagged != null) {
    if (enriched.critical == null)
      enriched.critical = Math.round(enriched.flagged * 0.12)
    if (enriched.high == null)
      enriched.high = Math.round(enriched.flagged * 0.33)
    if (enriched.medium == null)
      enriched.medium =
        enriched.flagged - (enriched.critical ?? 0) - (enriched.high ?? 0)
    if (enriched.openCases == null)
      enriched.openCases = Math.round(enriched.flagged * 0.18)
    if (enriched.newToday == null)
      enriched.newToday = Math.round(enriched.flagged * 0.021)
    if (enriched.overdueInspections == null)
      enriched.overdueInspections = Math.round(enriched.flagged * 0.018)
  }

  if (enriched.confirmed != null) {
    if (enriched.assessed == null)
      enriched.assessed = enriched.confirmed * 600_000
    if (enriched.realized == null)
      enriched.realized = Math.round((enriched.assessed ?? 0) * 0.62)
    if (enriched.closedYesterday == null)
      enriched.closedYesterday = Math.max(
        0,
        Math.round(enriched.confirmed * 0.014),
      )
  }

  if (Array.isArray(enriched.children)) {
    enriched.children = enriched.children.map(enrichChild)
  }

  return enriched
}

export function getRoleAwareInsight(
  screen: ScreenName,
  roleId: RoleId,
): string | null {
  const screenInsights = ROLE_INSIGHTS[screen]
  if (!screenInsights) return null
  return screenInsights[roleId] ?? null
}

export function getHierarchyInsight(scopeId: string): string | null {
  return HIER_AI[scopeId] ?? null
}

export function getOvernightDeltas(level: EnrichedLevel): OvernightDelta[] {
  const newCriticals = Math.max(
    1,
    Math.round((level.critical ?? 0) * 0.024),
  )
  const closedYesterday =
    level.closedYesterday ?? Math.max(0, Math.round((level.confirmed ?? 0) * 0.014))
  const recoveredWeek = Math.max(0, Math.round((level.realized ?? 0) * 0.011))
  const overdueInspections =
    level.overdueInspections ??
    Math.max(0, Math.round((level.flagged ?? 0) * 0.018))

  const recoveredDisplay =
    recoveredWeek >= 10_000_000
      ? `₹${(recoveredWeek / 10_000_000).toFixed(2)} Cr`
      : recoveredWeek >= 100_000
        ? `₹${(recoveredWeek / 100_000).toFixed(1)} L`
        : `₹${formatIndian(recoveredWeek)}`

  return [
    {
      label: '⬆ Overnight',
      value: `+${formatIndian(newCriticals)}`,
      sub: 'new criticals · vs yesterday',
      color: 'var(--red)',
      bg: 'rgba(220,53,69,0.05)',
      border: 'rgba(220,53,69,0.18)',
      screen: 'meters',
    },
    {
      label: '✓ Closed yesterday',
      value: formatIndian(closedYesterday),
      sub: `cases · ₹${(closedYesterday * 42).toFixed(0)}K avg recovery`,
      color: 'var(--green)',
      bg: 'rgba(40,167,69,0.05)',
      border: 'rgba(40,167,69,0.18)',
      screen: 'cases',
    },
    {
      label: '₹ Recovered · week',
      value: recoveredDisplay,
      sub: '7-day rolling · ↑ vs prior week',
      color: 'var(--ai-purple)',
      bg: 'rgba(124,58,237,0.05)',
      border: 'rgba(124,58,237,0.18)',
      screen: 'assessment',
    },
    {
      label: '⏰ Overdue',
      value: formatIndian(overdueInspections),
      sub: 'inspections · > 7 days',
      color: 'var(--amber-dark)',
      bg: 'rgba(230,146,30,0.06)',
      border: 'rgba(230,146,30,0.22)',
      screen: 'cases',
    },
  ]
}

export function getMainKpiCards(level: EnrichedLevel): MainKpiCard[] {
  const flagged = level.flagged ?? 0
  const meters = level.meters ?? 0
  const critical = level.critical ?? 0
  const high = level.high ?? 0
  const medium = level.medium ?? 0
  const inspected = level.inspected ?? 0
  const confirmed = level.confirmed ?? 0
  const assessed = level.assessed ?? 0
  const realized = level.realized ?? 0
  const hitRate = level.hitRate ?? 0
  const loss = level.loss ?? 0
  const realizationRate =
    assessed > 0 ? ((realized / assessed) * 100).toFixed(1) : '0.0'

  const lossColor =
    loss > 22 ? 'var(--red)' : loss > 18 ? 'var(--amber)' : 'var(--green)'

  return [
    {
      label: 'AI flagged',
      value: formatIndian(flagged),
      sub: `${meters > 0 ? ((flagged / meters) * 100).toFixed(1) : '0'}% · ${formatIndian(meters)} total · View list →`,
      accentColor: 'var(--red)',
      screen: 'meters',
      breakdown:
        flagged > 0
          ? {
              criticalPct: (critical / flagged) * 100,
              highPct: (high / flagged) * 100,
              mediumPct: (medium / flagged) * 100,
              critical,
              high,
              medium,
            }
          : undefined,
    },
    {
      label: 'Inspected',
      value: formatIndian(inspected),
      sub: `${flagged > 0 ? ((inspected / flagged) * 100).toFixed(1) + '% of flagged · ' : ''}last 30 days`,
      accentColor: '#0EA5E9',
      screen: 'cases',
    },
    {
      label: 'Confirmed',
      value: formatIndian(confirmed),
      sub: `Hit rate: ${hitRate}%`,
      accentColor: 'var(--green)',
      screen: 'cases',
    },
    {
      label: 'Assessment',
      value: fmtINR(assessed),
      sub: `${formatIndian(confirmed)} cases · View →`,
      accentColor: 'var(--ai-purple)',
      valueColor: 'var(--ai-purple)',
      screen: 'assessment',
    },
    {
      label: 'Realization',
      value: fmtINR(realized),
      sub: `${realizationRate}% of assessed`,
      accentColor: 'var(--green)',
      valueColor: 'var(--green)',
      screen: 'assessment',
    },
    {
      label: 'AT&C loss',
      value: `${loss}%`,
      sub: 'View audit →',
      accentColor: 'var(--teal)',
      valueColor: lossColor,
      screen: 'analytics',
    },
  ]
}

export function getQueueByRole(
  roleId: RoleId,
  level: EnrichedLevel,
): QueueItem[] {
  const flagged = level.flagged ?? 100
  const confirmed = level.confirmed ?? 30
  const assessed = level.assessed ?? 1_000_000

  const queueByRole: Record<RoleId, QueueItem[]> = {
    cmd: [
      {
        icon: '⚖️',
        label: 'Tariff petition awaiting your sign-off',
        meta: '15 May deadline · 9 days',
        action: 'Review',
        actionScreen: 'executive',
      },
      {
        icon: '📊',
        label: 'Q1 FY26 board pack ready for distribution',
        meta: '10 slides · auto-generated',
        action: 'Open',
        actionScreen: 'executive',
      },
      {
        icon: '🔥',
        label: 'Active fire: 33kV trip in DVVNL Agra',
        meta: 'Ops director monitoring · ETA 16:00',
        action: 'Brief',
        actionScreen: 'executive',
      },
    ],
    chief: [
      {
        icon: '📋',
        label: '4 inspection orders awaiting your approval',
        meta: '₹64 L assessed · routed by SE-Bhelupur',
        action: 'Review',
        actionScreen: 'cases',
      },
      {
        icon: '⚠',
        label: 'Hit rate dropped 3pp in Bhelupur West',
        meta: `Past 7 days · ${formatIndian(Math.round(flagged * 0.06))} inspections`,
        action: 'Audit',
        actionScreen: 'analytics',
      },
      {
        icon: '⚖️',
        label: '7 Section 135 cases ready for prosecution',
        meta: 'Each > ₹5L · forwarded by vigilance',
        action: 'Sanction',
        actionScreen: 'cases',
      },
    ],
    se: [
      {
        icon: '📋',
        label: `${formatIndian(Math.max(1, Math.round(flagged * 0.012)))} inspections pending your approval`,
        meta: 'Routed by AEN · oldest 4 days',
        action: 'Approve',
        actionScreen: 'cases',
      },
      {
        icon: '⚖️',
        label: `${formatIndian(Math.max(1, Math.round(confirmed * 0.08)))} assessment orders awaiting sign-off`,
        meta: `Section 135 · ₹${formatIndian(Math.round(assessed * 0.025 / 100_000))}L total`,
        action: 'Sign',
        actionScreen: 'assessment',
      },
      {
        icon: '📝',
        label: `${formatIndian(Math.max(1, Math.round(flagged * 0.008)))} appeals filed against your orders`,
        meta: 'Hearing scheduled next week',
        action: 'Prepare',
        actionScreen: 'appeals',
      },
    ],
    ee: [
      {
        icon: '🗺',
        label: '14 DTs flagged high-loss in your sub-division',
        meta: 'AT&C > 22% · field verification needed',
        action: 'Plan',
        actionScreen: 'networkmap',
      },
      {
        icon: '📋',
        label: `${formatIndian(Math.max(1, Math.round(flagged * 0.04)))} inspections to assign to JEs today`,
        meta: 'Field roster · 6 teams available',
        action: 'Assign',
        actionScreen: 'team',
      },
      {
        icon: '📷',
        label: '8 inspection photos awaiting your QA',
        meta: 'Uploaded last 24 hrs · auto-tagged',
        action: 'Verify',
        actionScreen: 'photos',
      },
    ],
    aen: [
      {
        icon: '📍',
        label: 'Your inspection roster: 5 today',
        meta: '3 in Kamachha · 2 in Sigra · routes planned',
        action: 'View map',
        actionScreen: 'networkmap',
      },
      {
        icon: '📷',
        label: 'Upload pending: 3 inspections',
        meta: 'Photos + Form-A required · per SOP',
        action: 'Upload',
        actionScreen: 'mobile',
      },
      {
        icon: '⚠',
        label: 'DTR-1849 flagged critical · 4 escalations',
        meta: 'Your DT zone · review before EOD',
        action: 'Open',
        actionScreen: 'dtload',
      },
    ],
    analyst: [
      {
        icon: '📊',
        label: '2 scheduled reports due today',
        meta: 'AT&C analysis + theft typology',
        action: 'Open',
        actionScreen: 'reports',
      },
      {
        icon: '🔍',
        label: 'Custom query saved: Cluster anomalies',
        meta: 'Last run: yesterday 14:00',
        action: 'Re-run',
        actionScreen: 'nlquery',
      },
      {
        icon: '📈',
        label: 'New dataset available: April MRI batch',
        meta: '1.8 M reads · ready for analysis',
        action: 'Explore',
        actionScreen: 'analytics',
      },
    ],
  }

  return queueByRole[roleId] ?? queueByRole.se
}

export function getHotspots(level: EnrichedLevel): HotspotItem[] {
  const hotspot1Crit = Math.max(3, Math.round((level.critical ?? 50) * 0.04))
  const hotspot2Count = Math.max(8, Math.round((level.flagged ?? 100) * 0.022))
  const hotspot3Hours = 48 + Math.round((level.flagged ?? 10) % 13)

  return [
    {
      severity: 'red',
      labelHtml: `<strong>DTR-1849 · Kamachha</strong> · ${hotspot1Crit} new tamper events overnight`,
      meta: '412 consumers · loss 21.9% · AT&C ↑ 2.1pp WoW',
      action: 'Inspect',
      actionScreen: 'dtload',
    },
    {
      severity: 'amber',
      labelHtml: `<strong>Cluster in Aliganj</strong> · ${hotspot2Count} meters simultaneous load drop`,
      meta: 'Possible organized theft · pattern detected 04:18 IST',
      action: 'Cluster',
      actionScreen: 'clusters',
    },
    {
      severity: 'amber',
      labelHtml: `<strong>Comms offline cluster · Sigra</strong> · 23 meters > ${hotspot3Hours}h silent`,
      meta: 'AMISP SLA breach · vendor escalation needed',
      action: 'Open',
      actionScreen: 'integrations',
    },
  ]
}

export function getLossColor(loss: number): string {
  if (loss > 22) return 'var(--red)'
  if (loss > 18) return 'var(--amber)'
  return 'var(--green)'
}

export function getHitRateColor(hitRate: number): string {
  if (hitRate > 60) return 'var(--green)'
  if (hitRate > 50) return 'var(--amber)'
  return 'var(--red)'
}

export function isConsumerLevel(type: HierNodeType | string | undefined): boolean {
  return type === 'DTR'
}
