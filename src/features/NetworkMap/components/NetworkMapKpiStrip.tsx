import { useToast } from '@/shared/context/ToastContext'
import { useScope } from '@/shared/context/ScopeContext'
import { useNavigate } from 'react-router-dom'
import type { NetworkMapKpis } from '../types'

interface NetworkMapKpiStripProps {
  kpis: NetworkMapKpis
}

/** 5-KPI strip matching the prototype. */
export function NetworkMapKpiStrip({ kpis }: NetworkMapKpiStripProps) {
  const { showToast } = useToast()
  const scope = useScope()
  const navigate = useNavigate()

  return (
    <div className="kpi-row">
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Theft hotspot feeders',
            message: `${kpis.hotspotsCount} feeders at this scope show AT&C loss above 24% — these are theft-flow concentrations worth a coordinated raid.`,
            duration: 5000,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Theft hotspots</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{kpis.hotspotsCount}</div>
        <div className="kpi-sub">feeders &gt; 24% loss</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() => {
          if (kpis.topFeeder) {
            scope.drillToChild(kpis.topFeeder.id)
          } else {
            showToast({
              type: 'info',
              title: 'No feeder data',
              message: 'No feeders mapped at this scope yet.',
            })
          }
        }}
      >
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Highest-loss feeder</div>
        <div className="kpi-value" style={{ fontSize: 14 }}>
          {kpis.topFeeder ? kpis.topFeeder.name : '—'}
        </div>
        <div className="kpi-sub">
          {kpis.topFeeder ? (kpis.topFeeder.loss || 0).toFixed(1) + '% AT&C' : 'no data'}
        </div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'warning',
            title: 'Under-billing DTs',
            message: `${kpis.underBillingCount} DTs have abnormally high loss percentages, indicating consumption greater than billed energy. Recommend MRI download + reconciliation.`,
            duration: 5500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Under-billing DTs</div>
        <div className="kpi-value" style={{ color: 'var(--ai-purple)' }}>
          {kpis.underBillingCount}
        </div>
        <div className="kpi-sub">loss &gt; 25%</div>
      </div>

      <div
        className="kpi-card clickable"
        onClick={() => navigate('/cases')}
      >
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Confirmed theft on map</div>
        <div className="kpi-value">{kpis.confirmedTheft}</div>
        <div className="kpi-sub">geo-tagged cases</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Asset coverage</div>
        <div className="kpi-value" style={{ color: 'var(--green)' }}>
          {kpis.dtsCoverage}%
        </div>
        <div className="kpi-sub">DTs with geo-tags</div>
      </div>
    </div>
  )
}
