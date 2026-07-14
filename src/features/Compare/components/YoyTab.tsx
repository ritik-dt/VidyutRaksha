import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { YoyCharts } from './YoyCharts'
import { YoyTable } from './YoyTable'

interface YoyTabProps {
  scopeName: string
}

/** Year-over-year tab (screenshots 1-2). Teal accent card + AI banner + 2 charts + table. */
export function YoyTab({ scopeName }: YoyTabProps) {
  const cardTitle =
    scopeName === 'Varanasi Zone' || scopeName === 'UPPCL'
      ? 'KVVNL overall (all divisions)'
      : `${scopeName} overall`

  return (
    <div className="card" style={{ border: '2px solid var(--teal)' }}>
      <div className="card-title" style={{ color: 'var(--teal-dark)' }}>
        📅 Year-over-year — {cardTitle}
        <ChartInfoButton chartId="yoy-loss" />
      </div>

      <div
        className="ai-insight mb-3.5"
        style={{ background: 'rgba(23,162,184,.1)' }}
      >
        <div className="ai-insight-body" style={{ color: 'var(--teal-dark)' }}>
          <strong>AI YoY analysis:</strong> AT&C loss improved from{' '}
          <strong className="text-ai-purple">24.8% (2024)</strong> →{' '}
          <strong className="text-ai-purple">22.6% (2025)</strong> →{' '}
          <strong className="text-ai-purple">20.5% (2026 YTD)</strong> — a{' '}
          <strong className="text-ai-purple">4.3pp cumulative improvement</strong> over 2 years.
          Hit rate improved from 48% → 53% → 57%. Recovered energy grew from 9.2 lakh kWh → 14.5
          lakh kWh → 18.2 lakh kWh.{' '}
          <strong className="text-ai-purple">VidyutRaksha deployed May 2025</strong> — the
          inflection is clearly visible between 2024 and 2025.
        </div>
      </div>

      <YoyCharts />

      <YoyTable />
    </div>
  )
}
