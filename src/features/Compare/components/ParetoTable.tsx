import { useToast } from '@/shared/context/ToastContext'
import type { ParetoEnriched } from '../data/paretoData'

interface ParetoTableProps {
  enriched: ParetoEnriched[]
}

/** 7-col × 12-row Pareto ranking table with Audit-batch buttons on vital-few rows. */
export function ParetoTable({ enriched }: ParetoTableProps) {
  const { showToast } = useToast()

  return (
    <div className="table-wrap mt-3.5">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th>Rank</th>
            <th>DTR</th>
            <th>Loss %</th>
            <th>Share of feeder loss</th>
            <th>Cumulative</th>
            <th>Class</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {enriched.map((item, i) => {
            const isVital = item.isVital
            const rank = i + 1
            const rankColor = i < 3 ? 'var(--red)' : 'var(--text)'
            const lossColor =
              item.loss > 10 ? 'var(--red)' : item.loss > 5 ? 'var(--amber)' : 'var(--text-mid)'
            const cumColor =
              item.cumulative >= 80
                ? 'var(--text-dim)'
                : item.cumulative >= 50
                  ? 'var(--amber)'
                  : 'var(--red)'
            const badgeColor = isVital ? 'var(--red)' : 'var(--green)'
            const badgeLabel = isVital ? 'VITAL FEW' : 'Trivial'
            return (
              <tr
                key={item.name}
                className="table-row"
                style={isVital ? { background: 'rgba(220,53,69,0.025)' } : undefined}
              >
                <td className="font-bold" style={{ color: rankColor }}>
                  {rank}
                </td>
                <td className="font-semibold">{item.name}</td>
                <td className="font-mono font-bold" style={{ color: lossColor }}>
                  {item.loss.toFixed(1)}%
                </td>
                <td className="font-mono font-semibold">{item.share.toFixed(1)}%</td>
                <td className="font-mono font-semibold" style={{ color: cumColor }}>
                  {item.cumulative.toFixed(1)}%
                </td>
                <td>
                  <span
                    className="inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] font-semibold"
                    style={{
                      fontSize: 9,
                      background: `${badgeColor}18`,
                      color: badgeColor,
                      borderColor: `${badgeColor}55`,
                    }}
                  >
                    {badgeLabel}
                  </span>
                </td>
                <td>
                  {isVital && (
                    <button
                      type="button"
                      className="btn btn-ai btn-sm"
                      style={{ fontSize: 10, padding: '3px 8px' }}
                      onClick={() =>
                        showToast({
                          type: 'success',
                          title: 'Inspection batch queued',
                          message: `AI dispatching inspector teams to ${item.name} for priority audit. Expected 6 cases within 48 hrs.`,
                          duration: 4500,
                        })
                      }
                    >
                      Audit batch →
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
