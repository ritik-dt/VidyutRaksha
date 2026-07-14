// ── ChartCard (shared) ───────────────────────────────────────────────────────
// A single-series chart card: bar / line / area switching, table view, and PNG
// download — the prototype's chartCtrl() behaviour in one component.
//
// Promoted from features/Analytics when Data Quality became the third consumer
// (Analytics, Team, DataQuality), per the reuse rule.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
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
  ChartControls,
  ChartTableView,
  downloadChartPng,
  exportChartCSV,
  type ChartKind,
  type ChartTableData,
  type ViewMode,
} from '@/shared/components/ui/ChartViewControls'
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
  CHART_LEGEND_LABELS as LEGEND_LABELS,
} from '@/shared/config/chartOptions'

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

export interface SingleSeriesConfig {
  label: string
  labels: string[]
  values: number[]
  colors: string[] | string
  showLegend?: boolean
  yMax?: number
  /** 'y' → horizontal bars (Chart.js indexAxis). Default 'x'. */
  indexAxis?: 'x' | 'y'
  /** Overrides bar width — default 0.6. Prototype funnel uses 0.4, billing/aging 0.5. */
  barPercentage?: number
}

function SingleSeriesCanvas({
  kind,
  cfg,
  canvasRef,
  chartRef,
}: {
  kind: ChartKind
  cfg: SingleSeriesConfig
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  chartRef: React.MutableRefObject<Chart | null>
}) {
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }

    const chartType = kind === 'area' ? 'line' : kind === 'step' ? 'line' : kind
    const primaryColor = Array.isArray(cfg.colors) ? cfg.colors[0] : cfg.colors
    const isBar = kind === 'bar'
    const dataset: Record<string, unknown> = {
      label: cfg.label,
      data: cfg.values,
      backgroundColor: isBar ? cfg.colors : primaryColor,
      borderColor: isBar ? 'transparent' : primaryColor,
      borderWidth: isBar ? 0 : 2,
      pointBackgroundColor: primaryColor,
    }
    if (isBar) {
      dataset.borderRadius = 3
      dataset.barPercentage = cfg.barPercentage ?? 0.6
    } else if (kind === 'area') {
      dataset.fill = true
      dataset.tension = 0.3
    } else if (kind === 'step') {
      dataset.stepped = true
      dataset.fill = false
      dataset.tension = 0
    } else {
      dataset.fill = false
      dataset.tension = 0.3
    }

    // Prototype's exact approach: same scales config for both orientations —
    // Chart.js's bar-type defaults handle beginAtZero on the value axis.
    // Matches `{...chartOpts, indexAxis:'y'}` in initRevenueCharts().
    const xAxis = { grid: { display: false }, ticks: { font: FONT, color: AXIS } }
    const yAxis: Record<string, unknown> = {
      grid: { color: GRID },
      ticks: { font: FONT, color: AXIS },
    }
    if (cfg.yMax != null) yAxis.max = cfg.yMax

    chartRef.current = new Chart(el, {
      type: chartType,
      data: { labels: cfg.labels, datasets: [dataset as never] },
      options: {
        indexAxis: cfg.indexAxis ?? 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: cfg.showLegend ? { display: true, position: 'bottom', labels: LEGEND_LABELS } : { display: false },
          tooltip: TOOLTIP,
        },
        scales: { x: xAxis, y: yAxis },
      },
    })

    return () => { try { chartRef.current?.destroy() } catch { /* noop */ } }
  }, [kind, cfg, canvasRef, chartRef])

  return <canvas ref={canvasRef} />
}

interface ChartCardProps {
  title: ReactNode
  cfg: SingleSeriesConfig
  filename: string
  /**
   * Caption rendered BETWEEN the header and the chart, matching the prototype's
   * `<div class="page-sub" style="margin:-4px 0 10px">` (e.g. "Meter count by
   * MRI age bucket"). Distinct from `footer`, which sits below the chart.
   */
  subtitle?: ReactNode
  /** Optional content rendered inside the card, below the chart (e.g. AI caption). */
  footer?: ReactNode
}

/**
 * Chart card with bar/line/area toggle + table view + PNG download.
 * Matches prototype's `chartCtrl` output — all 3 view types + table + download
 * exactly as `chartCtrl(chartId, ['bar','line','area'], 'bar')` renders.
 */
export function ChartCard({ title, cfg, filename, subtitle, footer }: ChartCardProps) {
  const [kind, setKind] = useState<ChartKind>('bar')
  const [view, setView] = useState<ViewMode>('chart')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const tableData = useMemo<ChartTableData>(
    () => ({
      labels: cfg.labels,
      datasets: [{ label: cfg.label, data: cfg.values }],
    }),
    [cfg.labels, cfg.values, cfg.label],
  )

  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[14px] font-bold">{title}</div>
        <ChartControls
          types={['bar', 'line', 'area']}
          activeType={kind}
          activeView={view}
          onTypeChange={(t) => { setKind(t); setView('chart') }}
          onTableToggle={() => setView((v) => (v === 'table' ? 'chart' : 'table'))}
          onDownload={() => downloadChartPng(chartRef.current, filename)}
        />
      </div>

      {subtitle && <div className="page-sub chart-subtitle">{subtitle}</div>}

      {view === 'chart' ? (
        <div className="chart-container-lg">
          <SingleSeriesCanvas kind={kind} cfg={cfg} canvasRef={canvasRef} chartRef={chartRef} />
        </div>
      ) : (
        <ChartTableView
          data={tableData}
          onCopyCSV={() => exportChartCSV(tableData, filename + '.csv')}
        />
      )}

      {footer}
    </div>
  )
}
