import { PERCENTILE_ROWS, type PercentileBadge } from '../data/percentileData'

type CellColor = 'green' | 'amber' | 'red' | 'dim'

function colorVar(c?: CellColor): string | undefined {
  switch (c) {
    case 'green': return 'var(--green)'
    case 'amber': return 'var(--amber)'
    case 'red':   return 'var(--red)'
    case 'dim':   return 'var(--text-dim)'
    default:      return undefined
  }
}

/** Badge colors mapping — matches prototype's `badge-ai/assigned/new/confirmed` classes. */
const BADGE_COLORS: Record<PercentileBadge, string> = {
  ai:        'var(--ai-purple)',
  assigned:  'var(--amber)',
  new:       'var(--id-text, #0284c7)',
  confirmed: 'var(--red)',
}

/** Ranking table (screenshots 2-3). Direct port of prototype's 10-row table. */
export function PercentileTable() {
  return (
    <div className="table-wrap mt-3.5">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th>Rank</th>
            <th>Feeder</th>
            <th>AT&C loss</th>
            <th>Percentile</th>
            <th>vs median</th>
            <th>vs top performer</th>
            <th>Recommended action</th>
          </tr>
        </thead>
        <tbody>
          {PERCENTILE_ROWS.map((row) => {
            const badgeColor = BADGE_COLORS[row.percentileBadge]
            const rowTint =
              row.rowTint === 'green'
                ? 'rgba(40,167,69,.05)'
                : row.rowTint === 'red'
                  ? 'rgba(220,53,69,.05)'
                  : undefined
            return (
              <tr
                key={row.rank}
                className="table-row"
                style={rowTint ? { background: rowTint } : undefined}
              >
                <td className="font-bold" style={row.rankColor ? { color: colorVar(row.rankColor) } : undefined}>
                  {row.medal ? `${row.medal} ${row.rank}` : row.rank}
                </td>
                <td className="font-semibold">{row.feeder}</td>
                <td
                  className="font-mono font-bold"
                  style={{ color: colorVar(row.lossColor) }}
                >
                  {row.atcLossPct}%
                </td>
                <td>
                  <span
                    className="inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] text-[10px] font-semibold"
                    style={{
                      background: `${badgeColor}18`,
                      color: badgeColor,
                      borderColor: `${badgeColor}55`,
                    }}
                  >
                    {row.percentile === 0 ? '0 %ile' : `${row.percentile}th %ile`}
                  </span>
                </td>
                <td style={{ color: colorVar(row.vsMedianColor) }}>{row.vsMedianPp}</td>
                <td style={{ color: colorVar(row.vsTopColor) }}>{row.vsTopPp}</td>
                <td
                  className="text-[11px]"
                  style={row.actionColor ? { color: colorVar(row.actionColor) } : undefined}
                >
                  {row.action}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
