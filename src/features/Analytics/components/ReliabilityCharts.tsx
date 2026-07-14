import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { SAIDI_DATA } from '../data/reliability'
import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

/** SAIDI + SAIFI feeder charts — grid-2, sorted by SAIDI desc (screenshot 2). */
export function ReliabilityCharts() {
  const sortedByS = [...SAIDI_DATA].sort((a, b) => b.saidi - a.saidi)

  const saidiCfg: SingleSeriesConfig = {
    label: 'SAIDI (hrs)',
    labels: sortedByS.map((d) => d.feeder),
    values: sortedByS.map((d) => d.saidi),
    colors: sortedByS.map((d) => (d.saidi > 18 ? '#DC3545' : d.saidi > 12 ? '#E6921E' : '#28A745')),
    showLegend: true,
  }

  const saifiCfg: SingleSeriesConfig = {
    label: 'SAIFI',
    labels: sortedByS.map((d) => d.feeder),
    values: sortedByS.map((d) => d.saifi),
    colors: sortedByS.map((d) => (d.saifi > 10 ? '#DC3545' : d.saifi > 7 ? '#E6921E' : '#28A745')),
    showLegend: true,
  }

  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="min-w-0">
        <ChartCard
          title={<>SAIDI by feeder (hrs/month)<ChartInfoButton chartId="saidi-trend" /></>}
          cfg={saidiCfg}
          filename="saidi-by-feeder"
        />
      </div>
      <div className="min-w-0">
        <ChartCard
          title={<>SAIFI by feeder<ChartInfoButton chartId="saifi-trend" /></>}
          cfg={saifiCfg}
          filename="saifi-by-feeder"
        />
      </div>
    </div>
  )
}
