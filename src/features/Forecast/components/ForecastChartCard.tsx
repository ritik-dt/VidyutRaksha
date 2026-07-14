import { useEffect, useMemo, useRef, useState } from 'react'
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
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import {
  CHART_AXIS_COLOR as AXIS,
  CHART_GRID_COLOR as GRID,
  CHART_FONT as FONT,
  CHART_TOOLTIP as TOOLTIP,
  CHART_LEGEND_LABELS as LEGEND_LABELS,
} from '@/shared/config/chartOptions'
import type { ForecastChartData, ForecastDataset } from '../types'

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

/**
 * Map a Forecast dataset → a Chart.js dataset for the active kind, replicating
 * the prototype's `switchChartType` transform. The default (untoggled) paint is
 * preserved byte-for-byte: line/area respect each dataset's declared `fill`
 * (so the loss chart's 80% confidence band stays shaded), while bar mode uses
 * per-bar colours where present and drops the fill — exactly as the prototype
 * renders each chart on first paint.
 */
function toChartDataset(ds: ForecastDataset, kind: ChartKind): Record<string, unknown> {
  const base: Record<string, unknown> = {
    label: ds.label,
    data: ds.data,
    borderColor: ds.borderColor,
    borderWidth: ds.borderWidth ?? 2,
    pointRadius: ds.pointRadius ?? 2,
  }
  if (ds.borderDash) base.borderDash = ds.borderDash

  if (kind === 'bar') {
    base.backgroundColor = ds.barColors ?? ds.backgroundColor ?? ds.borderColor
    base.borderRadius = 3
    base.barPercentage = 0.6
    return base
  }

  // line / area
  base.backgroundColor = ds.backgroundColor
  base.pointBackgroundColor = ds.borderColor
  if (kind === 'area') {
    base.fill = true
    base.tension = 0.3
  } else {
    base.fill = ds.fill ?? false
    base.tension = ds.tension ?? 0.3
  }
  return base
}

function ForecastCanvas({
  kind,
  data,
  canvasRef,
  chartRef,
}: {
  kind: ChartKind
  data: ForecastChartData
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  chartRef: React.MutableRefObject<Chart | null>
}) {
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    try { chartRef.current?.destroy() } catch { /* noop */ }

    const chartType = kind === 'bar' ? 'bar' : 'line'
    chartRef.current = new Chart(el, {
      type: chartType,
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds) => toChartDataset(ds, kind)) as never,
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
  }, [kind, data, canvasRef, chartRef])

  return <canvas ref={canvasRef} />
}

interface ForecastChartCardProps {
  /** Left-side chart title (rendered next to the info button). */
  title: string
  /** Sub-line under the header (prototype's page-sub caption). */
  caption: string
  /** Key into the chart-info catalog for the ⓘ popover. */
  chartId: string
  data: ForecastChartData
  /** Toggle order + default (first entry). Mirrors chartCtrl(id, types, default). */
  types: ChartKind[]
  filename: string
}

/**
 * Multi-series chart card with type toggle + table view + PNG download + ⓘ info
 * button. Port of the prototype's `chartCtrl` header for the Forecast charts.
 */
export function ForecastChartCard({ title, caption, chartId, data, types, filename }: ForecastChartCardProps) {
  const [kind, setKind] = useState<ChartKind>(types[0])
  const [view, setView] = useState<ViewMode>('chart')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const tableData = useMemo<ChartTableData>(
    () => ({
      labels: data.labels,
      datasets: data.datasets.map((ds) => ({ label: ds.label, data: ds.data })),
    }),
    [data],
  )

  return (
    <div className="card min-w-0">
      <div className="chart-header mb-1 flex items-center justify-between gap-2">
        <div className="chart-header-title flex items-center text-[13px] font-bold text-text">
          {title}
          <ChartInfoButton chartId={chartId} />
        </div>
        <ChartControls
          types={types}
          activeType={kind}
          activeView={view}
          onTypeChange={(t) => { setKind(t); setView('chart') }}
          onTableToggle={() => setView((v) => (v === 'table' ? 'chart' : 'table'))}
          onDownload={() => downloadChartPng(chartRef.current, filename)}
        />
      </div>
      <div className="page-sub" style={{ margin: '-4px 0 10px' }}>{caption}</div>

      {view === 'chart' ? (
        <div className="chart-container-lg">
          <ForecastCanvas kind={kind} data={data} canvasRef={canvasRef} chartRef={chartRef} />
        </div>
      ) : (
        <ChartTableView data={tableData} onCopyCSV={() => exportChartCSV(tableData, filename + '.csv')} />
      )}
    </div>
  )
}
