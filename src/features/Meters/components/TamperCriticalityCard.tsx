import { useEffect, useMemo, useRef } from 'react'
import { Chart, type ChartOptions } from 'chart.js/auto'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'
import { categorizeTamperEvents } from '@/features/Meters/data/meterAnalysisData'
import { RealBadge } from './RunningTimeTodCards'

// Shared between the "Meter analysis" and "Tamper events" tabs — the prototype
// renders this exact card (renderTamperCategoryCard) in both places.
export function TamperCriticalityCard({ meter, canvasIdSuffix = '' }: { meter: SuspMeter; canvasIdSuffix?: string }) {
  const realData = REAL_METER_DATA[meter.id]
  const tamperCat = useMemo(() => categorizeTamperEvents(realData), [realData])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const years = useMemo(() => Object.keys(tamperCat.byYear).sort(), [tamperCat])
  const totals = useMemo(() => {
    const t = { critical: 0, high: 0, medium: 0 }
    years.forEach((y) => {
      t.critical += tamperCat.byYear[y].critical
      t.high += tamperCat.byYear[y].high
      t.medium += tamperCat.byYear[y].medium
    })
    return t
  }, [years, tamperCat])
  const grand = totals.critical + totals.high + totals.medium

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          { label: 'Critical', data: years.map((y) => tamperCat.byYear[y].critical), backgroundColor: '#DC3545', borderRadius: 3, barPercentage: 0.6 },
          { label: 'High', data: years.map((y) => tamperCat.byYear[y].high), backgroundColor: '#E6921E', borderRadius: 3, barPercentage: 0.6 },
          // Mirrors the prototype's "Medium" series exactly (its var(--amber-dark) CSS
          // variable isn't resolvable on a canvas fillStyle, so Chart.js renders it black —
          // matching the reference screenshots pixel-for-pixel).
          { label: 'Medium', data: years.map((y) => tamperCat.byYear[y].medium), backgroundColor: '#000000', borderRadius: 3, barPercentage: 0.6 },
        ],
      },
      options: {
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
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5' } },
          y: { stacked: true, grid: { color: '#EDF2F7' }, ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5' }, beginAtZero: true },
        },
      } as ChartOptions,
    })
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [years, tamperCat])

  const tamperAiText = useMemo(() => {
    if (grand === 0) return 'No tamper events on record.'
    const critPct = Math.round((totals.critical / grand) * 100)
    const lastYr = years[years.length - 1]
    const prevYr = years[years.length - 2]
    const lastTotal = lastYr ? tamperCat.byYear[lastYr].critical + tamperCat.byYear[lastYr].high + tamperCat.byYear[lastYr].medium : 0
    const prevTotal = prevYr ? tamperCat.byYear[prevYr].critical + tamperCat.byYear[prevYr].high + tamperCat.byYear[prevYr].medium : 0
    const trend = prevTotal > 0 ? Math.round(((lastTotal - prevTotal) / prevTotal) * 100) : null
    let trendText = 'Tamper activity stable YoY.'
    if (trend != null && trend > 30) trendText = `Tamper count rose ${trend}% YoY — escalating pattern.`
    else if (trend != null && trend < -10) trendText = `Tamper count dropped ${Math.abs(trend)}% YoY — possible deterrent effect from prior inspection.`
    return { critPct, trendText }
  }, [grand, totals, years, tamperCat])

  return (
    <div className="card">
      <div className="mb-0.5 flex items-center justify-between">
        <span className="flex items-center text-[13px] font-bold text-text">📊 Tamper event criticality · year-by-year<RealBadge isReal={tamperCat.isReal} /></span>
        <span className="text-[10px] text-text-dim">stacked by severity</span>
      </div>
      <div className="page-sub mb-2.5 -mt-1">
        <strong style={{ color: 'var(--red)' }}>Critical</strong> = Earth Loading + Magnetic Tamper ·{' '}
        <strong style={{ color: 'var(--amber)' }}>High</strong> = Neutral Disturbance + Cover Open ·{' '}
        <strong style={{ color: 'var(--amber-dark)' }}>Medium</strong> = Power Failure + Other
      </div>
      <div className="relative h-[220px]">
        <canvas ref={canvasRef} id={canvasIdSuffix ? `tamperCatChart-${canvasIdSuffix}` : undefined} />
      </div>
      <div className="mt-3 rounded-lg p-2.5 text-[10.5px] leading-[1.5]" style={{ background: 'var(--ai-purple-light)', color: 'var(--ai-purple)' }}>
        <strong>✦ AI:</strong>{' '}
        {typeof tamperAiText === 'string' ? (
          tamperAiText
        ) : (
          <>
            <strong>{tamperAiText.critPct}% of all events</strong> are critical (Earth/Magnetic). {tamperAiText.trendText}
          </>
        )}
      </div>
    </div>
  )
}
