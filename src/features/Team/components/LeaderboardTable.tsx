import type { TeamInspector } from '../types'

interface LeaderboardTableProps {
  inspectors: TeamInspector[]
}

const MONO = { fontFamily: 'var(--mono)' } as const

/** Rank-colour: gold (1-3), amber (4-5), red (else). Mirrors prototype ternary. */
function rankColor(rank: number): string {
  if (rank <= 3) return 'var(--green)'
  if (rank <= 5) return 'var(--amber)'
  return 'var(--red)'
}
function hitColor(v: number): string {
  if (v > 60) return 'var(--green)'
  if (v > 50) return 'var(--amber)'
  return 'var(--red)'
}

/**
 * Inspector leaderboard & scorecards. Port of the prototype's 11-column table
 * at the bottom of renderTeamScreen. The table is wide — wrapped in .table-wrap
 * with a min-width so it horizontal-scrolls on narrow screens.
 */
export function LeaderboardTable({ inspectors }: LeaderboardTableProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">Inspector leaderboard &amp; scorecards</div>
      <div className="table-wrap">
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr className="table-header">
              <th>Rank</th>
              <th>Inspector</th>
              <th>Zone</th>
              <th>Assigned</th>
              <th>Inspected</th>
              <th>Confirmed</th>
              <th>False +ve</th>
              <th>Pending</th>
              <th>Hit rate</th>
              <th>Avg close</th>
              <th>Recovered</th>
            </tr>
          </thead>
          <tbody>
            {inspectors.map((i) => (
              <tr key={i.id} className="table-row">
                <td style={{ fontWeight: 700, color: rankColor(i.rank) }}>#{i.rank}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'var(--ai-gradient)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i.init}
                    </div>
                    <span style={{ fontWeight: 600 }}>{i.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11 }}>{i.zone}</td>
                <td style={MONO}>{i.assigned}</td>
                <td style={MONO}>{i.inspected}</td>
                <td style={{ ...MONO, color: 'var(--green)', fontWeight: 700 }}>{i.confirmed}</td>
                <td style={{ ...MONO, color: 'var(--red)' }}>{i.falsePositive}</td>
                <td style={{ ...MONO, color: 'var(--amber)' }}>{i.pending}</td>
                <td style={{ fontWeight: 700, color: hitColor(i.hitRate) }}>{i.hitRate}%</td>
                <td style={MONO}>{i.avgClose}d</td>
                <td style={{ fontWeight: 700, color: 'var(--teal)' }}>
                  ₹{(i.recovered / 1000).toFixed(1)}K
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
