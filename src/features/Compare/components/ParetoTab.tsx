import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { useToast } from '@/shared/context/ToastContext'
import { PARETO_FEEDER_OPTIONS, PARETO_ITEMS, TOTAL_DTRS, enrichPareto } from '../data/paretoData'
import { ParetoChart } from './ParetoChart'
import { ParetoKpiStrip } from './ParetoKpiStrip'
import { ParetoTable } from './ParetoTable'

/** Pareto (80/20) tab (screenshots 1-3). Red-bordered card. */
export function ParetoTab() {
  const { showToast } = useToast()
  const { enriched, vitalCount, vitalShare, top3Total } = enrichPareto(PARETO_ITEMS)

  // Numbers used in the AI banner text.
  const vitalPct = (vitalCount / TOTAL_DTRS) * 100
  const uniformMultiplier = (vitalShare / 100) * 4 // matches prototype: 3.3× in banner

  return (
    <div className="card" style={{ border: '2px solid var(--red)' }}>
      <div
        className="card-title flex items-center justify-between gap-2 max-md:flex-col max-md:items-start"
        style={{ color: 'var(--red)' }}
      >
        <span>
          ✦ Pareto analysis — Rathayatra Feeder · {TOTAL_DTRS} DTRs ranked by loss contribution
          <ChartInfoButton chartId="pareto" />
        </span>
        <select
          className="form-select"
          style={{ padding: '5px 10px', fontSize: 11, fontWeight: 600 }}
          defaultValue={PARETO_FEEDER_OPTIONS[0]}
          onChange={() =>
            showToast({
              type: 'info',
              title: 'Scope changed',
              message: 'In production: would re-run Pareto on selected entity scope.',
              duration: 2500,
            })
          }
        >
          {PARETO_FEEDER_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div
        className="ai-insight mb-3.5"
        style={{ background: 'rgba(220,53,69,0.05)' }}
      >
        <div className="ai-insight-body" style={{ color: 'var(--red)' }}>
          <strong>✦ Pareto finding:</strong> The{' '}
          <strong className="text-ai-purple">
            top 3 DTRs (Shivpur Colony, Police Line, Adampur)
          </strong>{' '}
          alone account for{' '}
          <strong className="text-ai-purple">{top3Total.toFixed(1)}% of all loss</strong> on this
          feeder. The vital-few principle holds:{' '}
          <strong className="text-ai-purple">
            {vitalCount} of {TOTAL_DTRS} DTRs ({vitalPct.toFixed(0)}%) cause{' '}
            {vitalShare.toFixed(1)}% of loss
          </strong>
          .{' '}
          <strong className="text-ai-purple">
            Action: focus enforcement on these {vitalCount} DTRs first
          </strong>{' '}
          — same effort, {uniformMultiplier.toFixed(1)}× the recovery vs uniform enforcement.
        </div>
      </div>

      <ParetoChart enriched={enriched} vitalCount={vitalCount} vitalShare={vitalShare} />

      <div className="mt-3.5">
        <ParetoKpiStrip
          vitalCount={vitalCount}
          vitalShare={vitalShare}
          top3Total={top3Total}
        />
      </div>

      <ParetoTable enriched={enriched} />
    </div>
  )
}
