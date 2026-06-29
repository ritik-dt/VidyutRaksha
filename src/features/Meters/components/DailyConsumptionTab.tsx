import { useEffect, useMemo, useRef } from 'react'
import { Chart, type ChartOptions, type TooltipItem } from 'chart.js/auto'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { getDailyConsumptionData } from '../data/meterChartData'

interface DailyConsumptionTabProps {
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
    x: { grid: { display: false }, ticks: { font: { size: 9, family: 'IBM Plex Sans' }, color: '#8B95A5' } },
    y: { grid: { color: '#EDF2F7' }, ticks: { font: { size: 10, family: 'IBM Plex Sans' }, color: '#8B95A5' } },
  },
}

// ─── Daily Consumption Tab — mirrors the prototype's initDailyChart() exactly ─
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DailyConsumptionTab(_props: DailyConsumptionTabProps) {
  const data = useMemo(() => getDailyConsumptionData(), [])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()

    const kwh = data.map((d) => d.meter)
    const peerAvg = data.map((d) => d.peer)

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.map((d) => d.day),
        datasets: [
          {
            label: 'This meter (kWh/day)',
            data: kwh,
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124,58,237,.06)',
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 2,
            pointBackgroundColor: kwh.map((v, i) => (v < peerAvg[i] * 0.7 ? '#DC3545' : '#7C3AED')),
          },
          {
            label: 'Peer avg (kWh/day)',
            data: peerAvg,
            borderColor: '#28A745',
            borderDash: [6, 3],
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            borderWidth: 1.5,
            pointRadius: 0,
          },
        ],
      },
      options: {
        ...BASE_CHART_OPTS,
        plugins: {
          ...BASE_CHART_OPTS.plugins,
          tooltip: {
            ...BASE_CHART_OPTS.plugins?.tooltip,
            callbacks: {
              afterBody: (ctx: TooltipItem<'line'>[]) => {
                const i = ctx[0].dataIndex
                const diff = (((kwh[i] - peerAvg[i]) / peerAvg[i]) * 100).toFixed(0)
                return `vs peer: ${diff}%`
              },
            },
          },
        },
      } as ChartOptions,
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [data])

  return (
    <div>
      <div className="card mb-0">
        <div className="card-title mb-1 flex items-center gap-2 text-[13px] font-bold">
          ✦ Daily consumption vs peer group
        </div>
        <div className="mb-3 text-[10.5px] text-text-dim">
          Day-by-day kWh — shows exactly when the consumption drop started. Blue = this meter, dashed green = peer-group average.
        </div>
        <div className="relative h-[240px]">
          <canvas ref={canvasRef} />
        </div>

        <div className="mt-3.5 rounded-xl p-3 text-[11.5px] leading-[1.6] text-text-mid"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <div className="mb-1 font-bold" style={{ color: 'var(--ai-purple)' }}>✦ AI pattern analysis</div>
          The daily profile reveals a <strong>gradual decline starting around 8 Feb</strong>, not a sudden drop.
          This is consistent with a <strong>partial bypass</strong> being installed — the thief didn't disconnect
          fully but reduced the meter's recording by approximately 40–50%. The peer group average (green line)
          remained stable at ~19 kWh/day throughout, confirming this is{' '}
          <strong>not a seasonal or area-wide effect</strong>. By 3 Mar, consumption had dropped to near-zero,
          suggesting the bypass was extended to a full disconnect.
        </div>
      </div>
    </div>
  )
}
