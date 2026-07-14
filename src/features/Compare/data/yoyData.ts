/** YoY loss line chart — 3 datasets (2024/2025/2026) exact port from initCompareCharts. */
export const YOY_LOSS_DATA: {
  labels: string[]
  datasets: Array<{
    label: string
    data: Array<number | null>
    borderColor: string
    backgroundColor: string
    tension: number
    borderWidth: number
    pointRadius: number
    fill: boolean
  }>
} = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { label: '2024', data: [25.2, 24.9, 24.6, 24.3],       borderColor: '#DC3545', backgroundColor: 'transparent',           tension: 0.3, borderWidth: 2,   pointRadius: 3, fill: false },
    { label: '2025', data: [23.8, 23.1, 22.4, 22.6],       borderColor: '#E6921E', backgroundColor: 'transparent',           tension: 0.3, borderWidth: 2,   pointRadius: 3, fill: false },
    { label: '2026', data: [20.5, null, null, null],       borderColor: '#28A745', backgroundColor: 'rgba(40,167,69,.08)',    tension: 0.3, borderWidth: 2.5, pointRadius: 5, fill: true },
  ],
}

/** YoY hit rate bar chart — exact port. */
export const YOY_HIT_DATA = {
  labels: ['2024', '2025', '2026 YTD'],
  values: [48, 53, 57],
  colors: ['#DC3545', '#E6921E', '#28A745'],
}

/** Colors for the YoY summary table cells. */
type CellColor = 'red' | 'amber' | 'green' | 'default'

export interface YoyRow {
  metric: string
  v2024: string
  v2024Color?: CellColor
  v2025: string
  v2025Color?: CellColor
  v2026Ytd: string
  v2026YtdColor?: CellColor
  change: string
  changeColor: CellColor
}

/** 6-row YoY summary table — exact port from prototype. */
export const YOY_ROWS: YoyRow[] = [
  { metric: 'AT&C loss',         v2024: '24.8%',      v2024Color: 'red',    v2025: '22.6%',    v2025Color: 'amber', v2026Ytd: '20.5%',      v2026YtdColor: 'green', change: '↓ 4.3pp', changeColor: 'green' },
  { metric: 'Hit rate',          v2024: '48%',                                v2025: '53%',                          v2026Ytd: '57%',        v2026YtdColor: 'green', change: '+9pp',    changeColor: 'green' },
  { metric: 'Confirmed cases',   v2024: '408',                                v2025: '612',                          v2026Ytd: '816',        v2026YtdColor: 'green', change: '2.0x',    changeColor: 'green' },
  { metric: 'Recovered (kWh)',   v2024: '9,20,000',                           v2025: '14,50,000',                    v2026Ytd: '18,20,000',  v2026YtdColor: 'green', change: '2.0x',    changeColor: 'green' },
  { metric: 'Revenue recovered', v2024: '₹69L',                               v2025: '₹1.09 Cr',                     v2026Ytd: '₹1.42 Cr',   v2026YtdColor: 'green', change: '+₹73L',   changeColor: 'green' },
  { metric: 'Avg SAIDI',         v2024: '18.4 hrs',                           v2025: '16.8 hrs',                     v2026Ytd: '15.2 hrs',   v2026YtdColor: 'green', change: '↓ 3.2 hrs', changeColor: 'green' },
]

/** Map CellColor → CSS var. */
export function cellColor(c?: CellColor): string | undefined {
  switch (c) {
    case 'red':   return 'var(--red)'
    case 'amber': return 'var(--amber)'
    case 'green': return 'var(--green)'
    default:      return undefined
  }
}
