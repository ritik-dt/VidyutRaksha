import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { PercentileChart } from './PercentileChart'
import { PercentileTable } from './PercentileTable'

interface PercentileTabProps {
  scopeName: string
}

/** Percentile ranking tab (screenshots 1-3). Amber-bordered card. */
export function PercentileTab({ scopeName }: PercentileTabProps) {
  const cardTitle =
    scopeName === 'Varanasi Zone' || scopeName === 'UPPCL'
      ? 'all feeders in KVVNL Varanasi Zone'
      : `all feeders in ${scopeName}`

  return (
    <div className="card" style={{ border: '2px solid var(--amber)' }}>
      <div className="card-title" style={{ color: 'var(--amber-dark, #9c5a14)' }}>
        🏆 Percentile ranking — {cardTitle}
        <ChartInfoButton chartId="percentile-ranking" />
      </div>

      <div
        className="ai-insight mb-3.5"
        style={{ background: 'rgba(230,146,30,.1)' }}
      >
        <div className="ai-insight-body" style={{ color: 'var(--amber-dark, #9c5a14)' }}>
          <strong>AI ranking analysis:</strong> Entities are ranked within their cohort (same
          hierarchy level).{' '}
          <strong className="text-ai-purple">Feeder Rathayatra</strong> is in the{' '}
          <strong className="text-ai-purple">10th percentile</strong> for AT&C loss — meaning 90%
          of feeders are better.{' '}
          <strong className="text-ai-purple">Feeder Bhelupur</strong> is in the{' '}
          <strong className="text-ai-purple">80th percentile</strong> — top 20% performer. This
          objective ranking helps senior officers prioritize interventions without relying on gut
          feel.
        </div>
      </div>

      <div className="chart-container-lg">
        <PercentileChart />
      </div>

      <PercentileTable />
    </div>
  )
}
