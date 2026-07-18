import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { useToast } from '@/shared/context/ToastContext'
import { AutoInsightsPanel } from './components/AutoInsightsPanel'
import { ConsumerAnalyticsPanel } from './components/ConsumerAnalyticsPanel'
import { CriticalAlerts } from './components/CriticalAlerts'
import { DemandGenerationPanel } from './components/DemandGenerationPanel'
import { DetailSidePanel } from './components/DetailSidePanel'
import { EnergyFlowPanel } from './components/EnergyFlowPanel'
import { ExecutiveKpiStrip } from './components/ExecutiveKpiStrip'
import { MeteringHealthPanel } from './components/MeteringHealthPanel'
import { P2WarningsPanel } from './components/P2WarningsPanel'
import { PrepaidNonRechargePanel } from './components/PrepaidNonRechargePanel'
import { ReliabilityPanel } from './components/ReliabilityPanel'
import { RevenueSnapshotPanel } from './components/RevenueSnapshotPanel'
import { TimeModeBar } from './components/TimeModeBar'
import { TrendsPanel } from './components/TrendsPanel'
import { useDetailPanel } from './hooks/useDetailPanel'
import { useExecutive } from './hooks/useExecutive'
import { useTimeMode } from './hooks/useTimeMode'

/**
 * Composition root for the Executive View — a state-level (Chairman) command
 * dashboard for all 5 UPPCL DISCOMs.
 *
 * Faithful to the prototype's renderExecutive(): the prototype renders ONLY the
 * dashboard (time-mode bar → critical alerts → KPI strip → panel grid), with no
 * page header, scope breadcrumb, or separate AI-insight banner. The one insight
 * surface it has — the "Auto Insights" panel — lives inside the grid.
 *
 * Every panel is prop-driven from `useExecutive`; no component imports from
 * `data/*` directly. Swapping mock data for a live API is a one-file change in
 * useExecutive.ts — the type surface and component tree stay identical.
 */
export default function ExecutivePage() {
  const exec = useExecutive()
  const time = useTimeMode()
  const detail = useDetailPanel()
  const { showToast } = useToast()

  const toast = (msg: string) => showToast(msg)

  return (
    <div className="exec-scope">
      <div className="exec-wrap">
        <TimeModeBar
          mode={time.mode}
          activeMonth={time.activeMonth}
          onSetRealtime={time.setRealtime}
          onSetMonthly={time.setMonthly}
        />

        <CriticalAlerts
          alerts={exec.criticalAlerts}
          onOpenPanel={detail.open}
          onToast={toast}
        />

        <ExecutiveKpiStrip kpis={exec.kpis} onOpenPanel={detail.open} />

        <ErrorBoundary>
          <div className="exec-dashboard-grid">
            <EnergyFlowPanel data={exec.energyFlow} onOpenPanel={detail.open} />
            <DemandGenerationPanel data={exec.demandGeneration} onOpenPanel={detail.open} />
            <ReliabilityPanel data={exec.reliability} onOpenPanel={detail.open} />
            <ConsumerAnalyticsPanel
              data={exec.consumerAnalytics}
              onOpenPanel={detail.open}
              onToast={toast}
            />
            <MeteringHealthPanel data={exec.meteringHealth} onOpenPanel={detail.open} />
            <PrepaidNonRechargePanel data={exec.prepaidNonRecharge} onOpenPanel={detail.open} />
            <RevenueSnapshotPanel data={exec.revenueSnapshot} onOpenPanel={detail.open} />
            <P2WarningsPanel warnings={exec.p2Warnings} onOpenPanel={detail.open} />
            <TrendsPanel trends={exec.trends} onOpenPanel={detail.open} />
            <AutoInsightsPanel insights={exec.autoInsights} onOpenPanel={detail.open} />
          </div>
        </ErrorBoundary>
      </div>

      <DetailSidePanel
        isOpen={detail.openKey !== null}
        panel={detail.openKey ? exec.getPanel(detail.openKey) : null}
        onClose={detail.close}
        onToast={toast}
      />
    </div>
  )
}
