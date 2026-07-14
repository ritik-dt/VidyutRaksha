import { useEffect, useRef } from 'react'
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
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
import { PERCENTILE_CHART_ROWS, ZONE_MEDIAN, percentileBarColor } from '../data/percentileData'

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
)

/**
 * Percentile ranking chart — direct port of prototype's pctChart:
 * - Bars: 10 feeders with color coding (percentile ≥70 green, ≥40 amber, else red)
 * - Line overlay: zone median at 19.8, ai-purple (#7C3AED), dashed (borderDash [5,3])
 * - No chart controls (prototype doesn't include them here)
 */
export function PercentileChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }

    chartRef.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: PERCENTILE_CHART_ROWS.map((r) => r.feeder),
        datasets: [
          {
            label: 'AT&C Loss %',
            data: PERCENTILE_CHART_ROWS.map((r) => r.atcLossPct),
            backgroundColor: PERCENTILE_CHART_ROWS.map((r) => percentileBarColor(r.percentile)),
            borderRadius: 3,
            barPercentage: 0.6,
          },
          {
            label: 'Zone median',
            data: Array(PERCENTILE_CHART_ROWS.length).fill(ZONE_MEDIAN),
            type: 'line',
            borderColor: '#7C3AED',
            borderDash: [5, 3],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          } as never,
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
          y: { grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
        },
      },
    })

    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={canvasRef} />
}
