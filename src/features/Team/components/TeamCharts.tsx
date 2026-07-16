import { ChartCard } from '@/shared/components/ui/ChartCard'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import {
  INSP_HIT_LABELS,
  INSP_HIT_VALUES,
  INSP_LOAD_LABELS,
  INSP_LOAD_VALUES,
  assignedColor,
  hitRateColor,
} from '../data/teamInspectors'

/**
 * The two Team screen charts, rendered in a grid-2. Reuses the shared
 * ChartCard (already supports per-bar colour arrays + type toggle +
 * table view + PNG download) and adds an inline info-button next to each title.
 */
export function TeamCharts() {
  return (
    <div className="grid-2" style={{ marginBottom: 14 }}>
      {/*
        `min-w-0` releases CSS Grid's default `min-width: auto`, which otherwise
        pins the track to the canvas's current pixel width and blocks the chart
        from shrinking when the AI panel expands. Matches Analytics.
      */}
      <div className="min-w-0">
        <ChartCard
          title={
            <>
              Hit rate by inspector
              <ChartInfoButton chartId="hit-rate" />
            </>
          }
          cfg={{
            label: 'Hit rate %',
            labels: INSP_HIT_LABELS,
            values: INSP_HIT_VALUES,
            colors: INSP_HIT_VALUES.map(hitRateColor),
            showLegend: true,
          }}
          filename="team-hit-rate"
        />
      </div>
      <div className="min-w-0">
        <ChartCard
          title={
            <>
              Workload distribution
              <ChartInfoButton chartId="workload" />
            </>
          }
          cfg={{
            label: 'Cases assigned',
            labels: INSP_LOAD_LABELS,
            values: INSP_LOAD_VALUES,
            colors: INSP_LOAD_VALUES.map(assignedColor),
            showLegend: true,
          }}
          filename="team-workload"
        />
      </div>
    </div>
  )
}
