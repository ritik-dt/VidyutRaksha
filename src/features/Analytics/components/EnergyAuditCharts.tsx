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
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
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
import { LOSS_SPLIT_DATA, LOSS_SPLIT_STATS, WATERFALL_DATA } from '../data/audit'
import { DT_DATA } from '../data/dtData'
import { ChartCard, type SingleSeriesConfig } from '@/shared/components/ui/ChartCard'

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

const BASE_SCALE = {
  x: { grid: { display: false }, ticks: { font: FONT, color: AXIS } },
  y: { beginAtZero: true, grid: { color: GRID }, ticks: { font: FONT, color: AXIS } },
}

interface EnergyAuditChartsProps {
  levelName: string
  commercialLossPct: string
  theftPctOfLoss: number
}

export function EnergyAuditCharts({ levelName, commercialLossPct, theftPctOfLoss }: EnergyAuditChartsProps) {
  void levelName

  const waterfallCfg: SingleSeriesConfig = {
    label: '₹ Cr',
    labels: WATERFALL_DATA.labels,
    values: WATERFALL_DATA.values,
    colors: WATERFALL_DATA.colors,
    showLegend: false,
  }

  const lossSplitCfg: SingleSeriesConfig = {
    label: 'Loss %',
    labels: LOSS_SPLIT_DATA.labels,
    values: LOSS_SPLIT_DATA.values,
    colors: LOSS_SPLIT_DATA.colors,
    showLegend: true,
  }

  const dtLossCfg: SingleSeriesConfig = {
    label: 'Loss %',
    labels: DT_DATA.map((d) => d.dt),
    values: DT_DATA.map((d) => d.loss),
    colors: DT_DATA.map((d) => (d.loss > 22 ? '#DC3545' : d.loss > 15 ? '#E6921E' : '#28A745')),
    showLegend: true,
  }

  const dtLoadCfg: SingleSeriesConfig = {
    label: 'Loading %',
    labels: DT_DATA.map((d) => d.dt),
    values: DT_DATA.map((d) => d.load),
    colors: DT_DATA.map((d) => (d.load >= 90 ? '#DC3545' : d.load >= 75 ? '#E6921E' : '#28A745')),
    showLegend: true,
    yMax: 100,
  }

  return (
    <>
      <div className="grid-2 mb-3.5 gap-3.5">
        <div className="min-w-0">
          <ChartCard
            title={<>AT&C loss waterfall<ChartInfoButton chartId="atc-waterfall" /></>}
            cfg={waterfallCfg}
            filename="atc-loss-waterfall"
            footer={
              <div
                className="mt-2 rounded-md px-2.5 py-2 text-[11px]"
                style={{ background: 'var(--ai-purple-light)', color: 'var(--ai-purple)' }}
              >
                <strong>✦ AI:</strong> Commercial loss ({commercialLossPct}%) is above target. AI-detected theft accounts for ~{theftPctOfLoss}% — the rest is billing gaps and collection shortfall.
              </div>
            }
          />
        </div>
        <div className="min-w-0">
          <ChartCard
            title={<>Technical vs commercial loss<ChartInfoButton chartId="tech-vs-comm" /></>}
            cfg={lossSplitCfg}
            filename="tech-vs-commercial"
            footer={
              <div className="mt-2 flex flex-wrap gap-2">
                {LOSS_SPLIT_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="min-w-0 flex-1 rounded-md p-1.5 text-center"
                    style={{ background: 'var(--bg)', borderLeft: `3px solid ${s.color}` }}
                  >
                    <div className="text-[9px] text-text-dim">{s.label}</div>
                    <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </div>

      <div className="grid-2 mb-3.5 gap-3.5">
        <div className="min-w-0">
          <ChartCard
            title={<>DT loss distribution<ChartInfoButton chartId="dt-loss-top10" /></>}
            cfg={dtLossCfg}
            filename="dt-loss-distribution"
          />
        </div>
        <div className="min-w-0">
          <ChartCard
            title={<>DT loading status</>}
            cfg={dtLoadCfg}
            filename="dt-loading-status"
          />
        </div>
      </div>

      <PhaseBalanceCard />
    </>
  )
}

/* ── Phase balance card (3 datasets R/Y/B) ── */

function PhaseBalanceCard() {
  const [kind, setKind] = useState<ChartKind>('bar')
  const [view, setView] = useState<ViewMode>('chart')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chart = useRef<Chart | null>(null)

  const labels = DT_DATA.map((d) => d.dt)
  const rSeries = DT_DATA.map((d) => d.phaseR)
  const ySeries = DT_DATA.map((d) => d.phaseY)
  const bSeries = DT_DATA.map((d) => d.phaseB)

  const tableData = useMemo<ChartTableData>(
    () => ({
      labels,
      datasets: [
        { label: 'R', data: rSeries },
        { label: 'Y', data: ySeries },
        { label: 'B', data: bSeries },
      ],
    }),
    [labels, rSeries, ySeries, bSeries],
  )

  useEffect(() => {
    if (view !== 'chart') return
    const el = canvasRef.current
    if (!el) return
    try { chart.current?.destroy() } catch { /* noop */ }
    const chartType = kind === 'area' ? 'line' : kind === 'step' ? 'line' : kind
    const isBar = kind === 'bar'
    function ds(label: string, data: number[], color: string): Record<string, unknown> {
      const d: Record<string, unknown> = {
        label, data,
        backgroundColor: isBar ? color : color + '33',
        borderColor: isBar ? 'transparent' : color,
        borderWidth: isBar ? 0 : 2,
        pointBackgroundColor: color,
      }
      if (isBar) { d.borderRadius = 3; d.barPercentage = 0.75 }
      else if (kind === 'area') { d.fill = true; d.tension = 0.3 }
      else if (kind === 'step') { d.stepped = true; d.fill = false }
      else { d.fill = false; d.tension = 0.3 }
      return d
    }
    chart.current = new Chart(el, {
      type: chartType,
      data: {
        labels,
        datasets: [
          ds('R', rSeries, '#E86A6A'),
          ds('Y', ySeries, '#E6921E'),
          ds('B', bSeries, '#17A2B8'),
        ] as never,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom', labels: LEGEND_LABELS },
          tooltip: TOOLTIP,
        },
        scales: BASE_SCALE,
      },
    })
    return () => { try { chart.current?.destroy() } catch { /* noop */ } }
  }, [kind, view, labels, rSeries, ySeries, bSeries])

  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[14px] font-bold">Phase balance (R/Y/B %)</div>
        <ChartControls
          types={['bar', 'line', 'area']}
          activeType={kind}
          activeView={view}
          onTypeChange={(t) => { setKind(t); setView('chart') }}
          onTableToggle={() => setView((v) => (v === 'table' ? 'chart' : 'table'))}
          onDownload={() => downloadChartPng(chart.current, 'phase-balance')}
        />
      </div>
      {view === 'chart' ? (
        <div className="chart-container-lg">
          <canvas ref={canvasRef} />
        </div>
      ) : (
        <ChartTableView
          data={tableData}
          onCopyCSV={() => exportChartCSV(tableData, 'phase-balance.csv')}
        />
      )}
    </div>
  )
}
