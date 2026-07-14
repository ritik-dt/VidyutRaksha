import type { SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

/** MRI data freshness — meter count by age bucket.
 *  showLegend mirrors the prototype's chartOpts, which sets
 *  `legend: {display:true, position:'bottom'}` on every chart. Clicking the
 *  legend item hides the dataset and strikes the label through — that is
 *  Chart.js's default onClick, which the prototype also relies on. */
export const FRESHNESS_CHART: SingleSeriesConfig = {
  label: 'Meters',
  showLegend: true,
  labels: ['0-7 days', '7-30 days', '30-60 days', '60-90 days', '90+ days'],
  values: [1280000, 132000, 42000, 30000, 16000],
  colors: ['#28A745', '#17A2B8', '#E6921E', '#DC3545', '#8B2332'],
  barPercentage: 0.6,
}

/** Meter communication health — status distribution. */
export const COMM_HEALTH_CHART: SingleSeriesConfig = {
  label: 'Meters',
  showLegend: true,
  labels: ['Normal', 'Intermittent', 'Stopped'],
  values: [1420000, 32800, 47200],
  colors: ['#28A745', '#E6921E', '#DC3545'],
  barPercentage: 0.5,
}
