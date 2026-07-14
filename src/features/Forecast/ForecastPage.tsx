import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { useToast } from '@/shared/context/ToastContext'
import { useForecast } from './hooks/useForecast'
import { HorizonToggle } from './components/HorizonToggle'
import { ForecastKpiStrip } from './components/ForecastKpiStrip'
import { ForecastChartCard } from './components/ForecastChartCard'
import { AtRiskDtTable } from './components/AtRiskDtTable'

export default function ForecastPage() {
  const { showToast } = useToast()
  const {
    horizon,
    setHorizon,
    horizonPills,
    horizonData,
    kpis,
    lossForecast,
    revForecast,
    seasonalTheft,
    dtCapacity,
    atRiskDts,
    atRiskFilter,
    applyAtRiskFilter,
    clearFilter,
  } = useForecast()

  const filterEntries: FilterPillEntry[] = atRiskFilter
    ? [{ label: 'Filter', value: 'atrisk' }]
    : []

  return (
    <div className="pb-2">
      <PageHeader
        title="🔮 Forecast & predictive analytics"
        subtitle="AI-powered predictions for loss trend, DT overload, seasonal theft, and revenue recovery"
        actions={
          <>
            <HorizonToggle horizon={horizon} pills={horizonPills} onChange={setHorizon} />
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'AI deep forecast',
                  message: `Running an extended ${horizonData.label} forecast across loss, DT loading, seasonal theft, and revenue recovery…`,
                  duration: 3500,
                })
              }
            >
              ✦ AI deep forecast
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Forecast"
          onBack={clearFilter}
        />
      )}

      <AiInsightBanner
        live={false}
        title={`AI predictive insights — leveraging 3-4 years of historical data · horizon: ${horizonData.label}`}
      >
        Based on 3-year consumption patterns, I forecast{' '}
        <strong>KVVNL-wide AT&amp;C loss will drop to {horizonData.atc}</strong> within the{' '}
        {horizonData.label} (from current 20.5%) if current inspection rates continue. Note: the
        Varanasi Zone pilot area is already at 17.7% — ahead of the zone average.{' '}
        <strong>{horizonData.dtRisk} DTs at risk</strong> of exceeding 90% loading — recommend
        capacity augmentation. <strong>Summer theft spike</strong> expected in May-July,
        concentrated in agricultural feeders of DVVNL. Revenue recovery forecast:{' '}
        <strong>{horizonData.rev} over {horizonData.label}</strong>.
      </AiInsightBanner>

      <ForecastKpiStrip kpis={kpis} onAtRiskClick={applyAtRiskFilter} />

      <div className="grid-2 mb-3.5 mt-3.5 gap-3.5">
        <ForecastChartCard
          title="AT&C loss forecast"
          caption="Historical (solid) + forecast (dashed) with 80% confidence band"
          chartId="forecast-atc"
          data={lossForecast}
          types={['line', 'area', 'bar']}
          filename="loss-forecast"
        />
        <ForecastChartCard
          title="Revenue recovery forecast"
          caption="Quarterly revenue recovery — actual + predicted"
          chartId="forecast-atc"
          data={revForecast}
          types={['bar', 'line', 'area']}
          filename="revenue-forecast"
        />
      </div>

      <div className="grid-2 mb-3.5 gap-3.5">
        <ForecastChartCard
          title="Seasonal theft pattern"
          caption="Seasonal theft pattern — historical avg by month"
          chartId="seasonal-theft"
          data={seasonalTheft}
          types={['bar', 'line', 'area']}
          filename="seasonal-theft"
        />
        <ForecastChartCard
          title="DT loading projection"
          caption="DT loading growth — projection next 12 months"
          chartId="dt-overload"
          data={dtCapacity}
          types={['line', 'area', 'bar']}
          filename="dt-loading-projection"
        />
      </div>

      <AtRiskDtTable rows={atRiskDts} horizonLabel={horizonData.label} horizon={horizon} />
    </div>
  )
}
