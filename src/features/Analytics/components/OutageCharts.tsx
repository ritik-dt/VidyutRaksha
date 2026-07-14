import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { OUTAGE_CAUSE_DATA, OUTAGE_DURATION_DATA } from '../data/outage'
import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

/** Grid-2 outage charts (screenshot 1-2). Bar/Line/Area + Table + PNG download per prototype. */
export function OutageCharts() {
  const causeCfg: SingleSeriesConfig = {
    label: '%',
    labels: OUTAGE_CAUSE_DATA.labels,
    values: OUTAGE_CAUSE_DATA.values,
    colors: OUTAGE_CAUSE_DATA.colors,
    showLegend: true,
  }

  const durationCfg: SingleSeriesConfig = {
    label: 'Occurrences',
    labels: OUTAGE_DURATION_DATA.labels,
    values: OUTAGE_DURATION_DATA.values,
    colors: OUTAGE_DURATION_DATA.colors,
    showLegend: true,
  }

  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="min-w-0">
        <ChartCard
          title={<>Outage cause breakup<ChartInfoButton chartId="outage-causes" /></>}
          cfg={causeCfg}
          filename="outage-cause-breakup"
        />
      </div>
      <div className="min-w-0">
        <ChartCard
          title={<>Outage by duration<ChartInfoButton chartId="outage-causes" /></>}
          cfg={durationCfg}
          filename="outage-by-duration"
        />
      </div>
    </div>
  )
}
