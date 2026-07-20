import type { CSSProperties } from 'react'
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
 * Faithful to the prototype's Shadow-DOM output: time-mode bar → critical alerts
 * → KPI strip → 4-col dashboard grid with map-panel spanning 2 rows, exception
 * panel spanning 3 cols, insights panel spanning 2 rows.
 */
export default function ExecutivePage() {
  const exec = useExecutive()
  const time = useTimeMode()
  const detail = useDetailPanel()
  const { showToast } = useToast()

  const toast = (msg: string) => showToast(msg)

  // CSS custom properties — the Chairman palette (distinct from the AI-purple
  // app palette). Every child Tailwind arbitrary utility resolves against these.
  const execScopeStyle: CSSProperties = {
    ['--exec-bg' as string]: '#F0F4FA',
    ['--exec-bg2' as string]: '#E3EAF4',
    ['--exec-bg3' as string]: '#D4E0F0',
    ['--exec-surface' as string]: '#FFFFFF',
    ['--exec-surface2' as string]: '#FAFCFF',
    ['--exec-border' as string]: '#DDE5F0',
    ['--exec-border2' as string]: '#C8D6EC',
    ['--exec-ink' as string]: '#0A1628',
    ['--exec-ink2' as string]: '#1E3A5F',
    ['--exec-ink3' as string]: '#3B4F6E',
    ['--exec-ink4' as string]: '#6B7A99',
    ['--exec-ink5' as string]: '#9DB0CC',
    ['--exec-brand' as string]: '#1B72E8',
    ['--exec-brand-dark' as string]: '#1559B0',
    ['--exec-brand-light' as string]: '#E1EDFD',
    ['--exec-brand-mid' as string]: '#2680F5',
    ['--exec-brand-border' as string]: 'rgba(27, 114, 232, 0.20)',
    ['--exec-jade' as string]: '#22C55E',
    ['--exec-jade-bg' as string]: '#D8F5E0',
    ['--exec-jade-border' as string]: 'rgba(34, 197, 94, 0.25)',
    ['--exec-amber' as string]: '#D97706',
    ['--exec-amber-bg' as string]: '#FEF1DC',
    ['--exec-amber-border' as string]: 'rgba(217, 119, 6, 0.25)',
    ['--exec-crimson' as string]: '#EF4444',
    ['--exec-crimson-bg' as string]: '#FCE4E4',
    ['--exec-crimson-border' as string]: 'rgba(239, 68, 68, 0.25)',
    ['--exec-shadow-xs' as string]: '0 1px 3px rgba(10, 22, 40, 0.06)',
    ['--exec-shadow-sm' as string]: '0 2px 8px rgba(10, 22, 40, 0.07), 0 1px 2px rgba(10, 22, 40, 0.04)',
    ['--exec-shadow-md' as string]: '0 4px 20px rgba(10, 22, 40, 0.09), 0 2px 6px rgba(10, 22, 40, 0.05)',
    ['--exec-shadow-lg' as string]: '0 8px 40px rgba(10, 22, 40, 0.12), 0 4px 12px rgba(10, 22, 40, 0.06)',
    margin: '-12px -24px',
  }

  return (
    <div
      style={execScopeStyle}
      className="bg-[var(--exec-bg)] text-[var(--exec-ink)] font-['IBM_Plex_Sans',_system-ui,_sans-serif] text-[13px] leading-[1.5] min-w-0 overflow-x-hidden [&_*]:box-border [&_*]:min-w-0 max-[640px]:!-mx-4 max-[480px]:!-mx-3"
    >
      <div className="max-w-[1600px] w-full mx-auto pt-[16px] px-[20px] pb-[60px] max-[1200px]:pt-[14px] max-[1200px]:px-[16px] max-[1200px]:pb-[40px] max-[1024px]:pt-[12px] max-[1024px]:px-[14px] max-[1024px]:pb-[36px] max-[640px]:pt-[10px] max-[640px]:px-[12px] max-[640px]:pb-[28px] max-[480px]:pt-[8px] max-[480px]:px-[10px] max-[480px]:pb-[24px]">
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
          {/* Dashboard grid — responsive strategy:
              Desktop (>1400px): 4-col with map spanning rows 1-2
              Laptop (1024-1400): 3-col, map full-width
              Tablet (640-1024): 2-col, everything stacks
              Mobile (<640): 1-col single stack.
              Every panel section box uses min-w-0 so grid children can shrink. */}
          <div className="grid gap-[12px] max-[1024px]:gap-[10px] max-[640px]:gap-[8px] grid-cols-[1.1fr_1.1fr_1fr_1.2fr] grid-rows-[auto_auto_auto_auto] max-[1400px]:grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
            <div className="[grid-column:1] [grid-row:1] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <EnergyFlowPanel data={exec.energyFlow} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:2] [grid-row:1] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <DemandGenerationPanel data={exec.demandGeneration} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:3] [grid-row:1] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <ReliabilityPanel data={exec.reliability} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:4] [grid-row:1_/_3] max-[1400px]:[grid-column:1_/_-1] max-[1400px]:[grid-row:auto] max-[1024px]:[grid-column:1_/_-1] max-[1024px]:[grid-row:auto] max-[640px]:[grid-column:auto] max-[640px]:[grid-row:auto] min-w-0">
              <ConsumerAnalyticsPanel
                data={exec.consumerAnalytics}
                onOpenPanel={detail.open}
                onToast={toast}
              />
            </div>
            <div className="[grid-column:1] [grid-row:2] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <MeteringHealthPanel data={exec.meteringHealth} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:2] [grid-row:2] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <PrepaidNonRechargePanel data={exec.prepaidNonRecharge} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:3] [grid-row:2] max-[1024px]:[grid-column:auto] max-[1024px]:[grid-row:auto] min-w-0">
              <RevenueSnapshotPanel data={exec.revenueSnapshot} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:1_/_4] [grid-row:3] max-[1400px]:[grid-column:1_/_-1] max-[1024px]:[grid-column:1_/_-1] min-w-0">
              <P2WarningsPanel warnings={exec.p2Warnings} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:4] [grid-row:3_/_5] max-[1400px]:[grid-column:1_/_-1] max-[1400px]:[grid-row:auto] max-[1024px]:[grid-column:1_/_-1] max-[1024px]:[grid-row:auto] min-w-0">
              <AutoInsightsPanel insights={exec.autoInsights} onOpenPanel={detail.open} />
            </div>
            <div className="[grid-column:1_/_4] [grid-row:4] max-[1400px]:[grid-column:1_/_-1] max-[1024px]:[grid-column:1_/_-1] min-w-0">
              <TrendsPanel trends={exec.trends} onOpenPanel={detail.open} />
            </div>
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
