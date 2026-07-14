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
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
  CHART_LEGEND_LABELS as LEGEND_LABELS,
} from '@/shared/config/chartOptions'
import type { PeerFeeder } from '../types'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

const AXES = {
  x: { grid: { display: false }, ticks: { font: FONT, color: AXIS } },
  y: { grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
}

/** AT&C loss chart — 2 datasets (loss + technical baseline). */
function PeerLossCanvas({ peers }: { peers: PeerFeeder[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }
    chartRef.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: peers.map((p) => p.name),
        datasets: [
          {
            label: 'AT&C Loss %',
            data: peers.map((p) => p.atcLossPct),
            backgroundColor: peers.map((p) => p.color),
            borderRadius: 3,
            barPercentage: 0.6,
          },
          {
            label: 'Technical (baseline)',
            data: peers.map(() => 8.2),
            backgroundColor: 'rgba(23,162,184,.3)',
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
        scales: AXES,
      },
    })
    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [peers])

  return <canvas ref={canvasRef} />
}

/** Hit rate chart — single dataset. */
function PeerHitCanvas({ peers }: { peers: PeerFeeder[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }
    chartRef.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: peers.map((p) => p.name),
        datasets: [
          {
            label: 'Hit rate %',
            data: peers.map((p) => p.hitRatePct),
            backgroundColor: peers.map((p) => p.color),
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
        scales: AXES,
      },
    })
    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [peers])

  return <canvas ref={canvasRef} />
}

interface PeerChartsProps {
  peers: PeerFeeder[]
}

/** Grid-2 peer charts row (screenshot 2). Prototype has no chart controls here. */
export function PeerCharts({ peers }: PeerChartsProps) {
  return (
    <div className="grid-2 gap-3.5">
      <div className="min-w-0">
        <div className="chart-container-lg">
          <PeerLossCanvas peers={peers} />
        </div>
      </div>
      <div className="min-w-0">
        <div className="chart-container-lg">
          <PeerHitCanvas peers={peers} />
        </div>
      </div>
    </div>
  )
}
