import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'

interface DqChartsProps {
  freshness: SingleSeriesConfig
  commHealth: SingleSeriesConfig
}

/** The two Data Quality charts. Both reuse the shared ChartCard, which already
 *  provides the prototype's chartCtrl behaviour: bar/line/area switching, a
 *  table view, and PNG download. */
export function DqCharts({ freshness, commHealth }: DqChartsProps) {
  return (
    <div className="grid-2" style={{ marginBottom: 14 }}>
      <ChartCard
        title={
          <>
            MRI data freshness
            <ChartInfoButton chartId="mri-freshness" />
          </>
        }
        cfg={freshness}
        filename="mri-freshness"
        subtitle="Meter count by MRI age bucket"
      />
      <ChartCard
        title={
          <>
            Meter communication health
            <ChartInfoButton chartId="comm-health" />
          </>
        }
        cfg={commHealth}
        filename="comm-health"
        subtitle="Communication status distribution"
      />
    </div>
  )
}
