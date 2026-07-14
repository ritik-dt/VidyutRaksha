import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { PF_DATA, VOLTAGE_DATA } from '../data/pq'
import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

/** Grid-2 PQ charts (screenshot 1-2). Bar/Line/Area + Table + PNG per prototype. */
export function PqCharts() {
  const voltageCfg: SingleSeriesConfig = {
    label: 'Consumers',
    labels: VOLTAGE_DATA.labels,
    values: VOLTAGE_DATA.values,
    colors: VOLTAGE_DATA.colors,
    showLegend: true,
    barPercentage: 0.6,
  }

  const pfCfg: SingleSeriesConfig = {
    label: 'Consumers',
    labels: PF_DATA.labels,
    values: PF_DATA.values,
    colors: PF_DATA.colors,
    showLegend: true,
    barPercentage: 0.6,
  }

  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="min-w-0">
        <ChartCard
          title={<>Voltage distribution<ChartInfoButton chartId="voltage-profile" /></>}
          cfg={voltageCfg}
          filename="voltage-distribution"
        />
      </div>
      <div className="min-w-0">
        <ChartCard
          title={<>Power factor distribution<ChartInfoButton chartId="power-factor" /></>}
          cfg={pfCfg}
          filename="power-factor-distribution"
        />
      </div>
    </div>
  )
}
