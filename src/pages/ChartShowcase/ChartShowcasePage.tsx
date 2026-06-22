import { Button, SectionHeader, Badge, MetricTrend } from '@/shared/components/ui'
import {
  AreaChart,
  BarChart,
  ChartContainer,
  ChartLegend,
  DoughnutChart,
  HorizontalBarChart,
  KpiTrendChart,
  LineChart,
  PieChart,
  StackedBarChart,
} from '@/shared/components/charts'
import {
  consumerGrowthChart,
  consumerMixChart,
  atcLossTrend,
  atcLossBarChart,
  equipmentConditionChart,
  outageCountChart,
  revenueCollectionChart,
  feederPerformanceChart,
  loadCurveChart,
  transformerLoadingChart,
} from './mockCharts'
import { createLegendItems } from '@/shared/utils/chartConfig'

export function ChartShowcasePage() {
  const legendItems = createLegendItems(
    ['Domestic', 'Commercial', 'Industrial', 'Agricultural'],
    ['#1b72e8', '#00c2cb', '#7c3aed', '#22c55e'],
    [62, 18, 12, 8],
  )

  return (
    <div className="flex flex-col gap-[18px]">
      <SectionHeader
        title="Chart Infrastructure Showcase"
        subtitle="Reusable Chart.js primitives, shared config, and utility datasets for future dashboard modules."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="ai">Chart.js</Badge>
            <MetricTrend value="+12.4%" direction="up" />
            <Button variant="outline" size="sm">
              Export stub
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer
          title="Energy consumption"
          subtitle="Last 6 months"
          actions={<Badge variant="active">Trend line</Badge>}
          fullscreenReady
          onToggleFullscreen={() => undefined}
        >
          <LineChart
            data={consumerGrowthChart}
            ariaLabel="Active consumer growth trend line chart"
            description="Line chart showing active consumer growth over the last six months."
            height={260}
          />
        </ChartContainer>

        <ChartContainer
          title="Revenue collection"
          subtitle="Target vs collected"
          actions={<Button variant="ghost" size="sm">Details</Button>}
        >
          <BarChart
            data={revenueCollectionChart}
            ariaLabel="Revenue collection comparison bar chart"
            description="Grouped bar chart comparing target and collected revenue across six months."
            height={260}
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer title="Daily load curve" subtitle="Feeder demand profile">
          <AreaChart
            data={loadCurveChart}
            ariaLabel="Daily load curve area chart"
            description="Area chart showing demand fluctuations throughout the day."
            height={250}
          />
        </ChartContainer>

        <ChartContainer title="Feeder performance" subtitle="Availability and health">
          <HorizontalBarChart
            data={feederPerformanceChart}
            ariaLabel="Feeder performance horizontal bar chart"
            description="Horizontal bar chart showing feeder availability percentages."
            height={250}
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer title="Consumer mix" subtitle="Service category breakdown">
          <PieChart
            data={consumerMixChart}
            ariaLabel="Consumer mix pie chart"
            description="Pie chart showing the utility consumer mix by service category."
            height={260}
          />
          <ChartLegend items={legendItems} />
        </ChartContainer>

        <ChartContainer title="Outage profile" subtitle="Incident breakdown">
          <DoughnutChart
            data={outageCountChart}
            ariaLabel="Outage profile doughnut chart"
            description="Doughnut chart breaking outage count into operational categories."
            height={260}
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer title="Transformer loading" subtitle="Utilization by band">
          <StackedBarChart
            data={transformerLoadingChart}
            ariaLabel="Transformer loading stacked bar chart"
            description="Stacked bar chart showing transformer counts by loading band and critical alert count."
            height={260}
          />
        </ChartContainer>

        <ChartContainer title="AT&C loss trend" subtitle="Monthly KPI sparkline">
          <KpiTrendChart
            data={atcLossTrend}
            ariaLabel="AT and C loss KPI trend chart"
            description="Compact KPI trend chart for AT and C loss improvement."
            height={140}
          />
          <div className="text-xs leading-relaxed text-text-mid">
            <MetricTrend value="-2.1%" direction="down" /> year-over-year loss improvement.
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-3 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer
          title="Loading state"
          subtitle="Small skeleton"
          loading
          loadingSize="small"
        >
          <LineChart
            data={consumerGrowthChart}
            ariaLabel="Hidden loading example"
            description="This chart is replaced by a loading skeleton."
          />
        </ChartContainer>

        <ChartContainer
          title="Empty state"
          subtitle="No data available"
          empty
          emptyTitle="No feeder data yet"
          emptyDescription="This container safely handles empty datasets without rendering errors."
          emptyAction={<Button variant="outline" size="sm">Refresh</Button>}
        >
          <BarChart
            data={{
              labels: [],
              datasets: [],
            }}
            ariaLabel="Empty chart example"
            description="This chart intentionally has no dataset and renders the empty state."
          />
        </ChartContainer>

        <ChartContainer
          title="Error state"
          subtitle="Fallback rendering"
          error="The dataset failed validation before chart rendering."
          emptyAction={<Button variant="outline" size="sm">Retry</Button>}
        >
          <PieChart
            data={consumerMixChart}
            ariaLabel="Error chart example"
            description="This chart intentionally shows an error state."
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3.5 max-sm:grid-cols-1">
        <ChartContainer title="AT&C loss detail" subtitle="Quarterly performance snapshot">
          <BarChart
            data={atcLossBarChart}
            ariaLabel="AT and C loss trend bar chart"
            description="Quarterly AT and C loss trend."
            height={220}
          />
        </ChartContainer>

        <ChartContainer title="Equipment condition" subtitle="Transformer health summary">
          <DoughnutChart
            data={equipmentConditionChart}
            ariaLabel="Transformer condition doughnut chart"
            description="Placeholder donut chart used to validate reusable chart infrastructure."
            height={220}
          />
        </ChartContainer>
      </div>
    </div>
  )
}
