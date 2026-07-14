import type { HierNode } from '@/shared/types/hierarchy'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'

interface ReliabilityAverages {
  avgSaidi: string
  avgSaifi: string
  avgAsai: string
  avgCaifi: string
  avgMaifi: string
}

interface ReliabilityKpiStripProps {
  avgs: ReliabilityAverages
  level: HierNode | undefined
  levelName: string
}

/**
 * 7-KPI strip for the Reliability tab (screenshot 1):
 * SAIDI · SAIFI · CAIFI · MAIFI · CAIDI · ASAI · Consumers affected.
 * Colors + click toasts match the prototype exactly.
 */
export function ReliabilityKpiStrip({ avgs, level, levelName }: ReliabilityKpiStripProps) {
  const { showToast } = useToast()
  const saidi = parseFloat(avgs.avgSaidi)
  const saifi = parseFloat(avgs.avgSaifi)
  const caifi = parseFloat(avgs.avgCaifi)
  const maifi = parseFloat(avgs.avgMaifi)
  const caidi = (saidi / saifi).toFixed(2)

  const saidiColor = saidi > 15 ? 'var(--red)' : 'var(--amber)'
  const caifiColor = caifi > 15 ? 'var(--red)' : caifi > 10 ? 'var(--amber)' : 'var(--green)'
  const maifiColor = maifi > 30 ? 'var(--red)' : maifi > 20 ? 'var(--amber)' : 'var(--green)'

  const consumersAffected = level?.meters ? Math.round(level.meters * 0.18) : 270000

  return (
    <div className="kpi-row">
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'SAIDI — System Avg Interruption Duration',
            message: `Average outage hours per consumer per year. Current ${avgs.avgSaidi} hrs. CEA target: < 10 hrs urban, < 20 rural. Click feeder ranking table to drill into worst contributors.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">SAIDI (avg)</div>
        <div className="kpi-value" style={{ color: saidiColor }}>{avgs.avgSaidi} hrs</div>
        <div className="kpi-sub">System Avg Interruption Duration</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'SAIFI — System Avg Interruption Frequency',
            message: `Average outages per consumer per year. Current ${avgs.avgSaifi}. CEA target: < 5 events urban. High SAIFI with low SAIDI = many short outages.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">SAIFI (avg)</div>
        <div className="kpi-value">{avgs.avgSaifi}</div>
        <div className="kpi-sub">Avg Interruption Frequency</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'CAIFI — Customer Avg Interruption Frequency',
            message: `Outages per AFFECTED consumer (not all consumers). Current ${avgs.avgCaifi}. When CAIFI >> SAIFI, outages concentrate on a sub-population — equity issue. RDSS norm: within 1.5× of SAIFI.`,
            duration: 6000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label flex items-center">
          CAIFI (avg)<ChartInfoButton chartId="caifi" />
        </div>
        <div className="kpi-value" style={{ color: caifiColor }}>{avgs.avgCaifi}</div>
        <div className="kpi-sub">Customer Avg Interruption Freq</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'MAIFI — Momentary Avg Interruption Frequency',
            message: `Brief outages (<5 min) per consumer per year. Current ${avgs.avgMaifi}. Excluded from SAIDI but matters for industrial loads — flickers cause production stoppages. CEA benchmark: <25 events/yr urban.`,
            duration: 6000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label flex items-center">
          MAIFI (avg)<ChartInfoButton chartId="maifi" />
        </div>
        <div className="kpi-value" style={{ color: maifiColor }}>{avgs.avgMaifi}</div>
        <div className="kpi-sub">Momentary Interruption Freq</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'CAIDI — Customer Avg Interruption Duration',
            message: `Average duration per outage event (SAIDI / SAIFI). Current ${caidi} hrs. Tells you how long each outage lasts on average.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">CAIDI</div>
        <div className="kpi-value">{caidi} hrs</div>
        <div className="kpi-sub">Avg Duration per Outage</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'success',
            title: 'ASAI — Service Availability',
            message: `Percentage of time supply is available. Current ${avgs.avgAsai}%. CEA target: >99.95%. Computed as (8760 - SAIDI) / 8760 × 100.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">ASAI</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>{avgs.avgAsai}%</div>
        <div className="kpi-sub">Service Availability</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Consumers affected by outages',
            message: `Estimated ${formatIndian(consumersAffected)} consumers experienced at least one outage in the past month at ${levelName}. Top feeder by impact: Rathayatra.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Consumers affected</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{formatIndian(consumersAffected)}</div>
        <div className="kpi-sub">≥1 outage in last 30 days</div>
      </div>
    </div>
  )
}
