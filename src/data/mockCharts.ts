import type { ChartData } from '@/types'
import type { TrendData } from '@/types'

/**
 * -------------------------
 * COLORS
 * -------------------------
 */
const LEGACY_BLUE = '#1b72e8'
const LEGACY_CYAN = '#00c2cb'
const LEGACY_PURPLE = '#7c3aed'
const LEGACY_GREEN = '#22c55e'
const LEGACY_AMBER = '#f59e0b'
const LEGACY_RED = '#ef4444'

/**
 * -------------------------
 * TREND DATA (UI-friendly)
 * -------------------------
 */
export const consumerCountsTrend: TrendData[] = [
  { label: 'Jan', value: 118420 },
  { label: 'Feb', value: 119860 },
  { label: 'Mar', value: 121240 },
  { label: 'Apr', value: 123280 },
  { label: 'May', value: 124560 },
  { label: 'Jun', value: 125910 },
]

export const atcLossTrend: TrendData[] = [
  { label: 'Jan', value: 18.8 },
  { label: 'Feb', value: 18.1 },
  { label: 'Mar', value: 17.4 },
  { label: 'Apr', value: 16.9 },
  { label: 'May', value: 16.2 },
  { label: 'Jun', value: 15.8 },
]

/**
 * -------------------------
 * LINE / KPI CHARTS
 * -------------------------
 */
export const consumerGrowthChart: ChartData<'line'> = {
  labels: consumerCountsTrend.map((e) => e.label),
  datasets: [
    {
      label: 'Active Consumers',
      data: consumerCountsTrend.map((e) => e.value),
      borderColor: LEGACY_BLUE,
      backgroundColor: 'rgba(27,114,232,0.12)',
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    },
  ],
}

export const atcLossChart: ChartData<'line'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'AT&C Loss %',
      data: [18.8, 17.6, 16.9, 15.8],
      borderColor: LEGACY_AMBER,
      backgroundColor: 'rgba(245,158,11,0.12)',
      fill: true,
      tension: 0.35,
      pointRadius: 3,
    },
  ],
}

/**
 * -------------------------
 * BAR CHARTS
 * -------------------------
 */
export const revenueCollectionChart: ChartData<'bar'> = {
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Target',
      data: [16.2, 16.8, 17.1, 17.5, 18.0, 18.4],
      backgroundColor: LEGACY_CYAN,
    },
    {
      label: 'Collected',
      data: [15.4, 16.0, 16.5, 17.0, 17.8, 18.2],
      backgroundColor: LEGACY_BLUE,
    },
  ],
}

export const feederPerformanceChart: ChartData<'bar'> = {
  labels: ['Feeder-1', 'Feeder-2', 'Feeder-3', 'Feeder-4', 'Feeder-5', 'Feeder-6'],
  datasets: [
    {
      label: 'Availability %',
      data: [96, 95, 98, 93, 97, 94],
      backgroundColor: LEGACY_GREEN,
    },
  ],
}

export const atcLossBarChart: ChartData<'bar'> = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'AT&C Loss %',
      data: [18.8, 17.6, 16.9, 15.8],
      backgroundColor: LEGACY_AMBER,
    },
  ],
}

export const transformerLoadingChart: ChartData<'bar'> = {
  labels: ['0-25%', '25-50%', '50-75%', '75-90%', '90%+'],
  datasets: [
    {
      label: 'Transformers',
      data: [42, 118, 97, 51, 13],
      backgroundColor: LEGACY_BLUE,
    },
    {
      label: 'Critical alerts',
      data: [2, 4, 7, 12, 10],
      backgroundColor: LEGACY_RED,
    },
  ],
}

/**
 * -------------------------
 * AREA / LOAD CURVE
 * -------------------------
 */
export const loadCurveChart: ChartData<'line'> = {
  labels: ['00', '03', '06', '09', '12', '15', '18', '21'],
  datasets: [
    {
      label: 'Load (MW)',
      data: [42, 39, 41, 57, 74, 81, 88, 63],
      borderColor: LEGACY_PURPLE,
      backgroundColor: 'rgba(124,58,237,0.12)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
}

/**
 * -------------------------
 * PIE / DONUT CHARTS
 * -------------------------
 */
export const outageCountChart: ChartData<'doughnut'> = {
  labels: ['Planned', 'Transient', 'Fault', 'Weather', 'Equipment'],
  datasets: [
    {
      label: 'Outage count',
      data: [14, 26, 48, 18, 10],
      backgroundColor: [
        LEGACY_BLUE,
        LEGACY_CYAN,
        LEGACY_PURPLE,
        LEGACY_AMBER,
        LEGACY_RED,
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  ],
}

export const consumerMixChart: ChartData<'pie'> = {
  labels: ['Domestic', 'Commercial', 'Industrial', 'Agricultural'],
  datasets: [
    {
      label: 'Consumers',
      data: [62, 18, 12, 8],
      backgroundColor: [
        LEGACY_BLUE,
        LEGACY_CYAN,
        LEGACY_PURPLE,
        LEGACY_GREEN,
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  ],
}

export const equipmentConditionChart: ChartData<'doughnut'> = {
  labels: ['Healthy', 'Watch', 'Critical'],
  datasets: [
    {
      label: 'Transformers',
      data: [214, 64, 13],
      backgroundColor: [LEGACY_GREEN, LEGACY_AMBER, LEGACY_RED],
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  ],
}

/**
 * -------------------------
 * EMPTY STATE
 * -------------------------
 */
export const emptyChartDataset: ChartData<'line'> = {
  labels: [],
  datasets: [],
}

/**
 * -------------------------
 * LEGACY DASHBOARD (used by DashboardCharts)
 * -------------------------
 */

export const detectionFunnelTrend = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Flagged',
      data: [32000, 35000, 38000, 39500, 40000, 40500],
      color: '#EF4444',
    },
    {
      label: 'Inspected',
      data: [8500, 9200, 10100, 11000, 11500, 12040],
      color: '#F59E0B',
    },
    {
      label: 'Confirmed',
      data: [3800, 4600, 5200, 5800, 6400, 6870],
      color: '#22C55E',
    },
  ],
}

export const atcLossByDiscom = {
  labels: ['DVVNL', 'KVVNL', 'PUVVNL', 'MVVNL', 'PVVNL'],
  datasets: [
    {
      label: 'AT&C Loss %',
      data: [22.8, 23.8, 21.4, 19.2, 10.4],
      color: '#EF4444',
    },
  ],
}