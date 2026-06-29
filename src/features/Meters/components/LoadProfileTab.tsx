import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart, type ChartOptions, type ChartDataset } from 'chart.js/auto'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { getLoadProfileData } from '../data/meterChartData'
import { RunningTimeTodCards } from './RunningTimeTodCards'
import { ChartControls, ChartTableView, exportChartCSV, downloadChartPng, type ChartKind, type ViewMode } from './ChartViewControls'

interface LoadProfileTabProps {
  meter: SuspMeter
}

const BASE_CHART_OPTS: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 10, font: { size: 10, family: 'IBM Plex Sans' } } },
    tooltip: {
      backgroundColor: '#fff', titleColor: '#1A1A2E', bodyColor: '#4A5568', borderColor: '#E2E8F0',
      borderWidth: 1, padding: 8, cornerRadius: 8,
      titleFont: { size: 11, family: 'IBM Plex Sans' }, bodyFont: { size: 11, family: 'IBM Plex Sans' },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5' } },
    y: { grid: { color: '#EDF2F7' }, ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5' } },
  },
}

// ─── Load Profile Tab — mirrors the prototype's renderLoadTab() exactly ───────
export function LoadProfileTab({ meter }: LoadProfileTabProps) {
  const loadData = useMemo(() => getLoadProfileData(), [])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const [kind, setKind] = useState<ChartKind>('line')
  const [view, setView] = useState<ViewMode>('chart')

  const tableData = useMemo(
    () => ({
      labels: loadData.map((d) => d.time),
      datasets: [
        { label: 'kWh', data: loadData.map((d) => d.kwh) },
        { label: 'Demand (kW)', data: loadData.map((d) => d.demand) },
      ],
    }),
    [loadData],
  )

  // ── Chart.js render — mirrors prototype's switchChartType() dataset mutation ─
  useEffect(() => {
    if (view !== 'chart' || !canvasRef.current) return
    chartRef.current?.destroy()

    const isBar = kind === 'bar'
    const isArea = kind === 'area'
    const isStep = kind === 'step'
    const mappedType = isBar ? 'bar' : 'line'

    const kwhDs: ChartDataset = {
      label: 'kWh',
      data: loadData.map((d) => d.kwh),
      borderColor: '#0EA5E9',
      backgroundColor: isArea ? 'rgba(14,165,233,0.12)' : isBar ? '#0EA5E9' : 'transparent',
      fill: isArea,
      tension: isStep || isBar ? 0 : 0.3,
      stepped: isStep,
      borderWidth: isBar ? 0 : 2,
      pointRadius: isBar ? 0 : 2,
      borderRadius: isBar ? 3 : 0,
      barPercentage: isBar ? 0.6 : undefined,
    }
    const demandDs: ChartDataset = {
      label: 'Demand (kW)',
      data: loadData.map((d) => d.demand),
      borderColor: '#DC3545',
      backgroundColor: isBar ? 'rgba(220,53,69,0.7)' : 'transparent',
      fill: false,
      tension: isStep || isBar ? 0 : 0.3,
      stepped: isStep,
      borderWidth: isBar ? 0 : 1.5,
      pointRadius: isBar ? 0 : 2,
      borderDash: isBar ? undefined : [4, 3],
      borderRadius: isBar ? 3 : 0,
      barPercentage: isBar ? 0.6 : undefined,
      yAxisID: 'y1',
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: mappedType,
      data: { labels: loadData.map((d) => d.time), datasets: [kwhDs, demandDs] },
      options: {
        ...BASE_CHART_OPTS,
        scales: {
          ...BASE_CHART_OPTS.scales,
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#DC3545' },
          },
        },
      } as ChartOptions,
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [loadData, kind, view])

  return (
    <div>
      <div className="card mb-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="card-title text-[13px] font-bold">30-minute load survey + demand</div>
          <ChartControls
            types={['line', 'area', 'step', 'bar']}
            activeType={kind}
            activeView={view}
            onTypeChange={(t) => {
              setKind(t)
              setView('chart')
            }}
            onTableToggle={() => setView((v) => (v === 'table' ? 'chart' : 'table'))}
            onDownload={() => downloadChartPng(chartRef.current, `VidyutRaksha_loadSurvey_${meter.id}.png`)}
          />
        </div>
        <div className="mb-3 text-[10.5px] text-text-dim">Intraday consumption (kWh) + demand (kW) — 04 Jan 2026</div>

        {view === 'chart' ? (
          <div className="relative h-[240px]">
            <canvas ref={canvasRef} />
          </div>
        ) : (
          <ChartTableView
            data={tableData}
            onCopyCSV={() => exportChartCSV(tableData, `VidyutRaksha_loadSurvey_${meter.id}.csv`)}
          />
        )}
      </div>

      <RunningTimeTodCards meter={meter} />
    </div>
  )
}
