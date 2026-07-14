import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart, type ChartOptions, type ChartDataset } from 'chart.js/auto'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { getBillingHistoryData, getLoadFactorData } from '../data/meterChartData'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { ChartControls, ChartTableView, exportChartCSV, downloadChartPng, type ChartKind, type ViewMode } from '@/shared/components/ui/ChartViewControls'

interface BillingHistoryTabProps {
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

// ─── Billing History Tab — mirrors prototype's billing-tab init exactly ──────
export function BillingHistoryTab({ meter }: BillingHistoryTabProps) {
  const billingData = useMemo(() => getBillingHistoryData(), [])
  const lfData = useMemo(() => getLoadFactorData(), [])

  // Monthly consumption + demand (bar/line/area + table + download)
  const blCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const blChartRef = useRef<Chart | null>(null)
  const [blKind, setBlKind] = useState<ChartKind>('bar')
  const [blView, setBlView] = useState<ViewMode>('chart')

  const blTableData = useMemo(
    () => ({
      labels: billingData.map((d) => d.month),
      datasets: [
        { label: 'kWh', data: billingData.map((d) => d.kwh) },
        { label: 'Max Demand (kW)', data: billingData.map((d) => d.md) },
      ],
    }),
    [billingData],
  )

  useEffect(() => {
    if (blView !== 'chart' || !blCanvasRef.current) return
    blChartRef.current?.destroy()

    const isArea = blKind === 'area'
    const isBar = blKind === 'bar'
    const mappedType = isBar ? 'bar' : 'line'

    // kWh — mirrors prototype's `cfg.datasets[0]` + switchChartType() mutation exactly:
    // fill/tension toggle with chart type, but color is always the same navy (#1B4F72).
    const kwhDs: ChartDataset = {
      label: 'kWh',
      data: billingData.map((d) => d.kwh),
      backgroundColor: '#1B4F72',
      borderColor: '#1B4F72',
      fill: isArea,
      tension: isBar ? 0 : 0.3,
      borderWidth: isBar ? 0 : 2,
      pointRadius: isBar ? 0 : 2,
      borderRadius: isBar ? 3 : 0,
      barPercentage: isBar ? 0.6 : undefined,
    }
    // Max Demand — mirrors prototype's `cfg.datasets[1]`: hardcoded `type:"line"` on the
    // dataset itself, so it stays a continuous red line on its own axis no matter what
    // the kWh series is toggled to (Chart.js per-dataset type override on a mixed chart).
    const mdDs: ChartDataset = {
      type: 'line',
      label: 'Max Demand (kW)',
      data: billingData.map((d) => d.md),
      borderColor: '#DC3545',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#DC3545',
      yAxisID: 'y1',
    }

    blChartRef.current = new Chart(blCanvasRef.current, {
      type: mappedType,
      data: { labels: billingData.map((d) => d.month), datasets: [kwhDs, mdDs] },
      options: {
        ...BASE_CHART_OPTS,
        scales: {
          ...BASE_CHART_OPTS.scales,
          y1: {
            position: 'right',
            grid: { display: false },
            ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#DC3545' },
            title: { display: true, text: 'kW', font: { size: 10 }, color: '#DC3545' },
          },
        },
      } as ChartOptions,
    })

    return () => {
      blChartRef.current?.destroy()
      blChartRef.current = null
    }
  }, [billingData, blKind, blView])

  // Stats row
  const peakKwhIdx = billingData.reduce((best, d, i) => (d.kwh > billingData[best].kwh ? i : best), 0)
  const peakMdIdx = billingData.reduce((best, d, i) => (d.md > billingData[best].md ? i : best), 0)
  const recent = billingData[billingData.length - 1]
  const kwhDropPct = Math.round((1 - recent.kwh / billingData[peakKwhIdx].kwh) * 100)
  const mdDropPct = Math.round((1 - recent.md / billingData[peakMdIdx].md) * 100)

  // Load factor trend (plain Chart.js line, no controls — matches prototype)
  const lfCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const lfChartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!lfCanvasRef.current) return
    lfChartRef.current?.destroy()
    const lf = lfData.map((d) => d.lf)

    lfChartRef.current = new Chart(lfCanvasRef.current, {
      type: 'line',
      data: {
        labels: lfData.map((d) => d.month),
        datasets: [
          {
            label: 'Load Factor',
            data: lf,
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124,58,237,.06)',
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: lf.map((v) => (v < 0.15 ? '#DC3545' : '#7C3AED')),
          },
          {
            label: 'Normal range (0.15-0.30)',
            data: Array(lf.length).fill(0.22),
            borderColor: '#28A745',
            borderDash: [6, 3],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0,
            borderWidth: 1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        ...BASE_CHART_OPTS,
        scales: {
          ...BASE_CHART_OPTS.scales,
          y: {
            ...BASE_CHART_OPTS.scales?.y,
            min: 0,
            max: 0.4,
            ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5', callback: (v) => Number(v).toFixed(2) },
          },
        },
      } as ChartOptions,
    })

    return () => {
      lfChartRef.current?.destroy()
      lfChartRef.current = null
    }
  }, [lfData])

  return (
    <div>
      <div className="card mb-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="card-title flex items-center text-[13px] font-bold">Monthly consumption + demand<ChartInfoButton chartId="monthly-consumption" /></div>
          <ChartControls
            types={['bar', 'line', 'area']}
            activeType={blKind}
            activeView={blView}
            onTypeChange={(t) => {
              setBlKind(t)
              setBlView('chart')
            }}
            onTableToggle={() => setBlView((v) => (v === 'table' ? 'chart' : 'table'))}
            onDownload={() => downloadChartPng(blChartRef.current, `VidyutRaksha_billing_${meter.id}.png`)}
          />
        </div>
        <div className="mb-3 text-[10.5px] text-text-dim">Monthly kWh (bars) + Max Demand kW (red line) — dual axis</div>

        {blView === 'chart' ? (
          <div className="relative h-[240px]">
            <canvas ref={blCanvasRef} />
          </div>
        ) : (
          <ChartTableView
            data={blTableData}
            onCopyCSV={() => exportChartCSV(blTableData, `VidyutRaksha_billing_${meter.id}.csv`)}
          />
        )}

        <div className="mt-3 flex flex-wrap gap-4 rounded-lg bg-bg p-3 text-[11.5px]">
          {[
            { label: 'Peak kWh', value: `${billingData[peakKwhIdx].month} — ${billingData[peakKwhIdx].kwh} kWh`, color: 'var(--text)' },
            { label: 'Recent kWh', value: `${recent.month} — ${recent.kwh} kWh`, color: 'var(--red)' },
            { label: 'kWh drop', value: `-${kwhDropPct}%`, color: 'var(--red)' },
            { label: 'Peak MD', value: `${billingData[peakMdIdx].month} — ${billingData[peakMdIdx].md} kW`, color: 'var(--text)' },
            { label: 'Recent MD', value: `${recent.month} — ${recent.md} kW`, color: 'var(--amber)' },
            { label: 'MD drop', value: `-${mdDropPct}%`, color: 'var(--amber)' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-text-dim text-[10px]">{s.label}</div>
              <div className="font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-1 flex items-center text-[13px] font-bold">Load factor trend<ChartInfoButton chartId="load-factor" /></div>
        <div className="mb-3 text-[10.5px] text-text-dim">Monthly load factor vs normal range (0.15–0.30)</div>
        <div className="relative h-[160px]">
          <canvas ref={lfCanvasRef} />
        </div>
        <div className="mt-3 rounded-xl p-3 text-[11.5px] text-text-mid"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <strong className="text-ai-purple">✦ AI demand analysis: </strong>
          Consumption and demand both dropped ~54%, which is <strong>unusual</strong> — in a typical bypass,
          consumption drops but demand stays stable. In this case, the proportional decline suggests either{' '}
          <strong>genuine reduction in usage</strong> or a <strong>full bypass</strong> where the meter isn't
          recording any load at all. The load factor remained around 0.19–0.20 throughout, which is consistent
          with a complete diversion rather than partial tapping. Combined with 50 earth-loading events, the full
          bypass hypothesis is strongly supported.
        </div>
      </div>
    </div>
  )
}
