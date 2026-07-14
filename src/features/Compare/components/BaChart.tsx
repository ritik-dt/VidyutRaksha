import { useEffect, useRef } from 'react'
import type { ScriptableContext } from 'chart.js'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
} from '@/shared/config/chartOptions'
import { BA_CHART, DEPLOY_INDEX } from '../data/baData'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Tooltip,
)

/**
 * Before/After single-series line chart — direct port of prototype's baChart2.
 * - 27 monthly data points from Jan 2024 to Mar 2026
 * - Border color: red before May 2025 (index 16), green after
 * - Point radius 6 at May 25 (the ★ deployment marker), 2 elsewhere
 * - Point color: red before, purple at marker, green after
 * - Filled area with a vertical gradient (red → purple → green)
 * - No legend, no chart controls (prototype hides both)
 */
export function BaChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }

    chartRef.current = new Chart(el, {
      type: 'line',
      data: {
        labels: BA_CHART.labels,
        datasets: [
          {
            label: 'AT&C Loss %',
            data: BA_CHART.values,
            borderColor: (ctx: ScriptableContext<'line'>) => {
              // Prototype uses segment ctx.p0.parsed.x; use dataIndex here (equivalent).
              const idx = ctx.dataIndex
              return idx < DEPLOY_INDEX ? '#DC3545' : '#28A745'
            },
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: (ctx: ScriptableContext<'line'>) =>
              ctx.dataIndex === DEPLOY_INDEX ? 6 : 2,
            pointBackgroundColor: (ctx: ScriptableContext<'line'>) => {
              if (ctx.dataIndex < DEPLOY_INDEX) return '#DC3545'
              if (ctx.dataIndex === DEPLOY_INDEX) return '#7C3AED'
              return '#28A745'
            },
            backgroundColor: (ctx: ScriptableContext<'line'>) => {
              const chart = ctx.chart
              const { ctx: c } = chart
              const g = c.createLinearGradient(0, 0, 0, 300)
              g.addColorStop(0, 'rgba(220,53,69,.15)')
              g.addColorStop(0.6, 'rgba(124,58,237,.15)')
              g.addColorStop(1, 'rgba(40,167,69,.15)')
              return g
            },
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: TOOLTIP,
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: FONT, color: AXIS, maxRotation: 45, minRotation: 0 } },
          y: { beginAtZero: true, grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
        },
      },
    })

    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [])

  return <canvas ref={canvasRef} />
}
