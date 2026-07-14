import { useEffect, useRef } from 'react'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
  CHART_LEGEND_LABELS as LEGEND_LABELS,
} from '@/shared/config/chartOptions'
import { APPEAL_GROUNDS_DATA, APPEAL_OUTCOMES_DATA } from '../data/appeals'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

/* ── Grounds distribution — colored bar chart ── */
function GroundsChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    ch.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: APPEAL_GROUNDS_DATA.labels,
        datasets: [
          {
            label: '%',
            data: APPEAL_GROUNDS_DATA.values,
            backgroundColor: APPEAL_GROUNDS_DATA.colors,
            borderRadius: 3,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: LEGEND_LABELS },
          tooltip: TOOLTIP,
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: FONT, color: AXIS } },
          y: {
            beginAtZero: true,
            max: 45,
            grid: { color: GRID },
            ticks: {
              font: FONT,
              color: AXIS,
              precision: 0,
              stepSize: 5,
              autoSkip: false,
              maxTicksLimit: 10,
            },
          },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={ref} />
}

/* ── Outcomes stacked bar chart (Dismissed / Reduced / Upheld) ── */
function OutcomesChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    ch.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: APPEAL_OUTCOMES_DATA.labels,
        datasets: [
          { label: 'Dismissed', data: APPEAL_OUTCOMES_DATA.dismissed, backgroundColor: '#DC3545', borderRadius: 3, barPercentage: 0.6 },
          { label: 'Reduced',   data: APPEAL_OUTCOMES_DATA.reduced,   backgroundColor: '#E6921E', borderRadius: 3, barPercentage: 0.6 },
          { label: 'Upheld',    data: APPEAL_OUTCOMES_DATA.upheld,    backgroundColor: '#28A745', borderRadius: 3, barPercentage: 0.6 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: LEGEND_LABELS },
          tooltip: TOOLTIP,
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: FONT, color: AXIS } },
          y: { stacked: true, beginAtZero: true, grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={ref} />
}

/** Grid-2 chart row — grounds distribution + outcomes over 12 months. */
export function AppealChartsRow() {
  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="min-w-0">
        <div className="card">
          <div className="card-title">
            Appeal grounds distribution
            <ChartInfoButton chartId="appeal-grounds" />
          </div>
          <div className="chart-container-lg">
            <GroundsChart />
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <div className="card">
          <div className="card-title">
            Appeal outcomes (last 12 months)
            <ChartInfoButton chartId="appeal-outcomes" />
          </div>
          <div className="chart-container-lg">
            <OutcomesChart />
          </div>
        </div>
      </div>
    </div>
  )
}
