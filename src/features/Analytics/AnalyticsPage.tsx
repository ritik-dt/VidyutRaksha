import { PageHeader } from '@/shared/components/ui/PageHeader'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import { useAnalytics } from './hooks/useAnalytics'
import { AnalyticsTabStrip } from './components/AnalyticsTabStrip'
import { EnergyAuditKpiStrip } from './components/EnergyAuditKpiStrip'
import { EnergyAuditCharts } from './components/EnergyAuditCharts'
import { HierarchyBreakdownTable } from './components/HierarchyBreakdownTable'
import { DtLevelAuditTable } from './components/DtLevelAuditTable'
import { ReliabilityKpiStrip } from './components/ReliabilityKpiStrip'
import { ReliabilityCharts } from './components/ReliabilityCharts'
import { FeederReliabilityTable } from './components/FeederReliabilityTable'
import { OutageKpiStrip } from './components/OutageKpiStrip'
import { OutageCharts } from './components/OutageCharts'
import { SuspiciousOutageTable } from './components/SuspiciousOutageTable'
import { RevenueKpiStrip } from './components/RevenueKpiStrip'
import { RevenueCharts } from './components/RevenueCharts'
import { UnbilledReasonsTable } from './components/UnbilledReasonsTable'
import { PqKpiStrip } from './components/PqKpiStrip'
import { PqCharts } from './components/PqCharts'
import { PfPenaltyTable } from './components/PfPenaltyTable'
import { TOTAL_FEEDERS } from './data/audit'

export default function AnalyticsPage() {
  const { showToast } = useToast()
  const { activeTab, setActiveTab, scope, auditKpis, reliabilityAvgs, revenueKpis, unbilledRows, pqKpis } = useAnalytics()
  const levelName = scope.currentNode?.name ?? 'UPPCL'
  const levelType = scope.currentNode?.type ?? 'State'
  const scopeLabel = scope.hierPath.length > 1 ? levelName : 'All UPPCL'
  const commercialLossPct = scope.currentNode?.loss
    ? (scope.currentNode.loss - 8.2).toFixed(1)
    : '12.3'

  return (
    <div className="pb-2">
      <ScopeBreadcrumb />

      <PageHeader
        title="Energy audit & analytics"
        subtitle={
          <>
            Scoped to: <strong>{levelName}</strong> ({levelType}) — {scopeLabel}
          </>
        }
        actions={
          <>
            {scope.hierPath.length > 1 && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => scope.navigateToPathIndex(scope.hierPath.length - 2)}
              >
                ← Up one level
              </button>
            )}
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI audit report',
                  message: `Generating a comprehensive energy audit report for ${levelName} — losses, reliability, revenue, and power quality analysis.`,
                  duration: 4000,
                })
              }
            >
              ✦ AI audit report
            </button>
          </>
        }
      />

      <AnalyticsTabStrip activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'audit' && (
        <>
          <AiInsightBanner title={`AI audit — ${levelName}`}>
            Across <strong className="text-ai-purple">15 lakh consumers</strong>,{' '}
            <strong className="text-ai-purple">KVVNL (Kashi)</strong> has the highest flag rate at{' '}
            <strong className="text-ai-purple">2.88%</strong>.{' '}
            <strong className="text-ai-purple">PUVVNL (Purvanchal)</strong> has the best hit rate at{' '}
            <strong className="text-ai-purple">63.4%</strong> — their field teams are most effective.
            DVVNL has the highest AT&C loss at <strong className="text-ai-purple">22.6%</strong> —
            recommend priority focus.
          </AiInsightBanner>

          <EnergyAuditKpiStrip kpis={auditKpis} levelName={levelName} totalFeeders={TOTAL_FEEDERS} />

          <EnergyAuditCharts
            levelName={levelName}
            commercialLossPct={commercialLossPct}
            theftPctOfLoss={auditKpis.theftPctOfLoss}
          />

          <div className="my-3.5">
            <HierarchyBreakdownTable tab="audit" />
          </div>

          <DtLevelAuditTable />
        </>
      )}

      {activeTab === 'reliability' && (
        <>
          <AiInsightBanner title={`AI reliability — ${levelName}`}>
            <strong className="text-ai-purple">Rathayatra Feeder</strong> has the worst reliability
            — SAIDI 22.8 hrs, degrading trend.{' '}
            <strong className="text-ai-purple">Raghunath Nagar</strong> is second worst at 20.4 hrs.
            Both feeders also have high AT&C losses (24-25%), suggesting a correlation between poor
            reliability and theft — areas with frequent outages have weaker enforcement presence.{' '}
            <strong className="text-ai-purple">CAIFI {reliabilityAvgs.avgCaifi}</strong> is
            meaningfully higher than SAIFI — outages concentrate on a subset of consumers (the same
            ~70% keep losing power).{' '}
            <strong className="text-ai-purple">MAIFI {reliabilityAvgs.avgMaifi}</strong> reveals
            frequent voltage flickers below the SAIDI threshold — material for industrial customers.
            Scoped to: <strong className="text-ai-purple">{levelName}</strong>.
          </AiInsightBanner>

          <ReliabilityKpiStrip
            avgs={reliabilityAvgs}
            level={scope.currentNode ?? undefined}
            levelName={levelName}
          />

          <ReliabilityCharts />

          <FeederReliabilityTable />

          <div className="mt-3 flex flex-wrap justify-end gap-1.5 max-sm:justify-stretch">
            <button
              type="button"
              className="btn btn-outline btn-sm max-sm:flex-1"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'SERC report downloaded',
                  message: `${levelName}_SERC_reliability_report.pdf — SAIDI/SAIFI/CAIFI trends per SERC template.`,
                  duration: 3500,
                })
              }
            >
              📄 Download SERC report
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm max-sm:w-full"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI monthly report',
                  message: `AI is generating the monthly reliability report for ${levelName} with root-cause analysis and improvement recommendations.`,
                  duration: 4000,
                })
              }
            >
              ✦ AI generate monthly report
            </button>
          </div>

          <div className="mt-3.5">
            <HierarchyBreakdownTable tab="reliability" />
          </div>
        </>
      )}

      {activeTab === 'outage' && (
        <>
          <AiInsightBanner title={`AI outage-theft correlation — ${levelName}`}>
            I've detected <strong className="text-ai-purple">14 consumers</strong> with suspicious
            outage patterns — they show{' '}
            <strong className="text-ai-purple">
              consumer-only off-periods while their DTR was live
            </strong>
            . 8 of these have off-time concentrated between 10 PM – 3 AM, suggesting{' '}
            <strong className="text-ai-purple">deliberate meter disconnection during night hours</strong>
            . Under DTR Vijaya Complex, 3 consumers have synchronized off-patterns — possible
            organized theft with manual switching.
          </AiInsightBanner>

          <OutageKpiStrip />

          <OutageCharts />

          <SuspiciousOutageTable />

          <div className="mt-3.5">
            <HierarchyBreakdownTable tab="outage" />
          </div>
        </>
      )}

      {activeTab === 'revenue' && (
        <>
          <AiInsightBanner title={`AI revenue analysis — ${levelName}`}>
            <strong className="text-ai-purple">Billing efficiency is 94.2%</strong> — 5.8% of
            meters (
            <strong className="text-ai-purple">
              {new Intl.NumberFormat('en-IN').format(revenueKpis.unbilledMeters)}
            </strong>
            ) were not billed this month. Of these,{' '}
            <strong className="text-ai-purple">
              {new Intl.NumberFormat('en-IN').format(unbilledRows[0].count)} are stopped meters
            </strong>{' '}
            (zero reading for 2+ months). Each unbilled meter is direct revenue loss. Collection
            rate is 88.4% —{' '}
            <strong className="text-ai-purple">₹{revenueKpis.outstandingCr} Cr outstanding</strong>
            .
          </AiInsightBanner>

          <RevenueKpiStrip kpis={revenueKpis} />

          <RevenueCharts />

          <UnbilledReasonsTable rows={unbilledRows} />

          <div className="mt-3.5">
            <HierarchyBreakdownTable tab="revenue" />
          </div>
        </>
      )}

      {activeTab === 'pq' && (
        <>
          <AiInsightBanner title={`AI power quality — ${levelName}`}>
            <strong className="text-ai-purple">VDI averaging {pqKpis.vdiPct}%</strong> across the
            network — within UPERC norms (target &lt;10%) but with{' '}
            <strong className="text-ai-purple">
              {pqKpis.vDeviations} measurement slots showing R-phase deviation beyond ±10%
            </strong>
            , concentrated in feeders Rathayatra and Raghunath Nagar.{' '}
            <strong className="text-ai-purple">System power factor at {pqKpis.powerFactor}</strong>{' '}
            overall;{' '}
            <strong className="text-ai-purple">
              {new Intl.NumberFormat('en-IN').format(pqKpis.lowPfConsumers)} consumers below 0.85
            </strong>{' '}
            — recoverable via UPERC PF penalties (₹{pqKpis.pfPenaltyCr} Cr). Voltage unbalance
            averaging <strong className="text-ai-purple">{pqKpis.vUnbalanceV} V</strong> (max phase
            differential) and current unbalance{' '}
            <strong className="text-ai-purple">{pqKpis.currentUnbalancePct}%</strong> — both within
            the 10% threshold but worth monitoring on industrial feeders.
          </AiInsightBanner>

          <PqKpiStrip kpis={pqKpis} levelName={levelName} />

          <PqCharts />

          <PfPenaltyTable />

          <div className="mt-3.5">
            <HierarchyBreakdownTable tab="pq" />
          </div>
        </>
      )}
    </div>
  )
}
