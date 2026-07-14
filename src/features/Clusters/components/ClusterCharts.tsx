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
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import {
  METHOD_LABELS,
  METHOD_COLORS,
  getMethodCounts,
  TIMELINE_MONTHS,
  getTimelineData,
} from '../data/clusters'
import type { Cluster } from '../types'

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Tooltip,
)

const AXIS = '#4A5568'
const GRID = 'rgba(0,0,0,0.05)'
const FONT = { size: 11, family: 'IBM Plex Sans, sans-serif' } as const
const TOOLTIP = {
  backgroundColor: '#fff',
  titleColor: '#1A1A2E',
  bodyColor: '#4A5568',
  borderColor: '#E2E8F0',
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
  titleFont: FONT,
  bodyFont: FONT,
}

/* ── Theft-method composition (bar) ── */
function MethodChart({ clusters }: { clusters: Cluster[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    ch.current = new Chart(el, {
      type: 'bar',
      data: {
        labels: METHOD_LABELS,
        datasets: [
          {
            label: 'Consumers',
            data: getMethodCounts(clusters),
            backgroundColor: METHOD_COLORS,
            borderRadius: 3,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 12, font: FONT, color: AXIS } },
          tooltip: TOOLTIP,
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: FONT, color: AXIS, maxRotation: 45, minRotation: 30 } },
          y: { beginAtZero: true, grid: { color: GRID }, ticks: { font: FONT, color: AXIS, precision: 0 } },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [clusters])

  return <canvas ref={ref} />
}

/* ── New cases detected over time (line) ── */
function TimelineChart({ clusters }: { clusters: Cluster[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    const { detected, resolved } = getTimelineData(clusters)
    ch.current = new Chart(el, {
      type: 'line',
      data: {
        labels: TIMELINE_MONTHS,
        datasets: [
          { label: 'Cases detected (cumulative)', data: detected, borderColor: '#DC3545', backgroundColor: 'rgba(220,53,69,.08)', fill: true, tension: 0.3, borderWidth: 2.5, pointRadius: 3 },
          { label: 'Cases resolved (cumulative)', data: resolved, borderColor: '#28A745', backgroundColor: 'transparent', fill: false, tension: 0.3, borderWidth: 2, pointRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 12, font: FONT, color: AXIS } },
          tooltip: TOOLTIP,
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: FONT, color: AXIS } },
          y: { beginAtZero: true, grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [clusters])

  return <canvas ref={ref} />
}

interface ClusterChartsProps {
  clusters: Cluster[]
  scopeSuffix: string
}

export function ClusterCharts({ clusters, scopeSuffix }: ClusterChartsProps) {
  return (
    <div className="grid-2 mb-3.5 gap-3.5">
      <div className="card">
        <div className="card-title">
          Theft methods used in active cases{scopeSuffix}
          <ChartInfoButton chartId="cluster-sizes" />
        </div>
        <div className="chart-container-lg">
          <MethodChart clusters={clusters} />
        </div>
      </div>
      <div className="card">
        <div className="card-title">
          New cases detected over time{scopeSuffix}
          <ChartInfoButton chartId="cluster-sizes" />
        </div>
        <div className="chart-container-lg">
          <TimelineChart clusters={clusters} />
        </div>
      </div>
    </div>
  )
}
