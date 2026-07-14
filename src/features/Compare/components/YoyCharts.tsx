import { useEffect, useRef } from 'react'
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js'
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
  CHART_LEGEND_LABELS as LEGEND_LABELS,
} from '@/shared/config/chartOptions'
import { YOY_HIT_DATA, YOY_LOSS_DATA } from '../data/yoyData'

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
)

const AXES = {
  x: { grid: { display: false }, ticks: { font: FONT, color: AXIS } },
  y: { grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
}

/** YoY loss trend line chart — 3 datasets (2024/2025/2026). */
function YoyLossCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }
    chartRef.current = new Chart(el, {
      type: 'line',
      data: {
        labels: YOY_LOSS_DATA.labels,
        datasets: YOY_LOSS_DATA.datasets as never,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: LEGEND_LABELS },
          tooltip: TOOLTIP,
        },
        scales: {
          x: AXES.x,
          y: { ...AXES.y, beginAtZero: true },
        },
      },
    })
    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={canvasRef} />
}

/** YoY hit rate bar chart — 3 bars (2024/2025/2026 YTD). */
function YoyHitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }
    chartRef.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: YOY_HIT_DATA.labels,
        datasets: [
          {
            label: 'Hit rate %',
            data: YOY_HIT_DATA.values,
            backgroundColor: YOY_HIT_DATA.colors,
            borderRadius: 3,
            barPercentage: 0.5,
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
        scales: AXES,
      },
    })
    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={canvasRef} />
}

/** Grid-2 YoY charts row (screenshot 1-2). Prototype has no chart controls here. */
export function YoyCharts() {
  return (
    <div className="grid-2 gap-3.5">
      <div className="min-w-0">
        <div className="chart-container-lg">
          <YoyLossCanvas />
        </div>
      </div>
      <div className="min-w-0">
        <div className="chart-container-lg">
          <YoyHitCanvas />
        </div>
      </div>
    </div>
  )
}
