import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { BaChart } from './BaChart'
import { BeforeAfterCards } from './BeforeAfterCards'
import { RoiStatRow } from './RoiStatRow'

interface BaTabProps {
  scopeName: string
}

/** Before/After Impact tab (screenshots 1-3). */
export function BaTab({ scopeName }: BaTabProps) {
  const cardTitle =
    scopeName === 'Varanasi Zone' || scopeName === 'UPPCL'
      ? 'KVVNL-wide (deployed May 2025)'
      : `${scopeName} (deployed May 2025)`

  return (
    <div className="card" style={{ border: '2px solid var(--green)' }}>
      <div className="card-title" style={{ color: 'var(--green)' }}>
        📊 Before vs After VidyutRaksha — {cardTitle}
        <ChartInfoButton chartId="before-after" />
      </div>

      <div
        className="ai-insight mb-3.5"
        style={{ background: 'rgba(40,167,69,.08)' }}
      >
        <div className="ai-insight-body" style={{ color: 'var(--green)' }}>
          <strong className="text-ai-purple">Program impact (KVVNL-wide):</strong> Since
          VidyutRaksha deployment,{' '}
          <strong className="text-ai-purple">
            zone-wide AT&C loss reduced from 24.8% → 20.5%
          </strong>{' '}
          (4.3pp improvement). The pilot area (Varanasi Zone) specifically has reached{' '}
          <strong className="text-ai-purple">17.7%</strong>, leading the zone. The product has
          paid back its annual platform cost{' '}
          <strong className="text-ai-purple">7.9× zone-wide</strong> through recovered revenue.
          Hit rate doubled (from ~28% manual baseline to 57% AI-guided). Time-to-detection
          dropped from ~60 days to ~4 hours.{' '}
          <strong className="text-ai-purple">
            Net value to KVVNL: ₹1.42 Cr recovered against ₹18L annual platform cost.
          </strong>
        </div>
      </div>

      <BeforeAfterCards />

      <div className="chart-container-lg">
        <BaChart />
      </div>

      <RoiStatRow />
    </div>
  )
}
