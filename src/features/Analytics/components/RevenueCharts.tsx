import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { AGING_DATA, BILLING_STATUS_DATA, FUNNEL_DATA } from '../data/revenue'
import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

/**
 * Revenue charts — three cards matching prototype layout exactly:
 * 1. Full-width Revenue leakage funnel (horizontal — `indexAxis:'y'`, `barPercentage:.4`)
 * 2. Grid-2: Billing status breakdown + Outstanding aging (both `barPercentage:.5`)
 */
export function RevenueCharts() {
  const funnelCfg: SingleSeriesConfig = {
    label: '₹ Cr',
    labels: FUNNEL_DATA.labels,
    values: FUNNEL_DATA.values,
    colors: FUNNEL_DATA.colors,
    showLegend: false,        // prototype hides legend on funnel
    barPercentage: 0.4,
  }

  const billingCfg: SingleSeriesConfig = {
    label: '%',
    labels: BILLING_STATUS_DATA.labels,
    values: BILLING_STATUS_DATA.values,
    colors: BILLING_STATUS_DATA.colors,
    showLegend: true,
    barPercentage: 0.5,
  }

  const agingCfg: SingleSeriesConfig = {
    label: '₹ Cr',
    labels: AGING_DATA.labels,
    values: AGING_DATA.values,
    colors: AGING_DATA.colors,
    showLegend: true,
    barPercentage: 0.5,
  }

  return (
    <>
      <div className="mb-3.5">
        <ChartCard
          title={<>Revenue leakage funnel<ChartInfoButton chartId="billing-efficiency" /></>}
          cfg={funnelCfg}
          filename="revenue-leakage-funnel"
        />
      </div>

      <div className="grid-2 mb-3.5 gap-3.5">
        <div className="min-w-0">
          <ChartCard
            title={<>Billing status breakdown<ChartInfoButton chartId="billing-efficiency" /></>}
            cfg={billingCfg}
            filename="billing-status-breakdown"
          />
        </div>
        <div className="min-w-0">
          <ChartCard
            title={<>Outstanding aging (₹ Cr)<ChartInfoButton chartId="collection-rate" /></>}
            cfg={agingCfg}
            filename="outstanding-aging"
          />
        </div>
      </div>
    </>
  )
}
