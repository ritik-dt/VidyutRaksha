import { getRiskColor } from '@/shared/components/ui/StatusBadge'
import { SUSPICIOUS_OUTAGES, type OutageBadgeVariant } from '../data/outage'

/**
 * ⚠ Suspicious consumer-level outage patterns (AI-detected). Direct port from
 * prototype — 4 rows with pattern badges (confirmed=red, assigned=amber) and
 * small (24×24) risk circles.
 */
export function SuspiciousOutageTable() {
  return (
    <div className="card">
      <div className="card-title" style={{ color: 'var(--red)' }}>
        ⚠ Suspicious consumer-level outage patterns (AI-detected)
      </div>
      <div className="table-wrap">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th>Consumer</th>
              <th>DTR</th>
              <th>Off-hours / month</th>
              <th>DTR live?</th>
              <th>Pattern</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {SUSPICIOUS_OUTAGES.map((row) => {
              const offColor = row.offHoursColor === 'red' ? 'var(--red)' : 'var(--amber)'
              const riskColor = getRiskColor(row.risk)
              return (
                <tr key={row.consumer} className="table-row">
                  <td className="font-semibold">{row.consumer}</td>
                  <td className="text-[11px]">{row.dtr}</td>
                  <td className="font-mono font-bold" style={{ color: offColor }}>{row.offHours} hrs</td>
                  <td className="font-semibold" style={{ color: 'var(--green)' }}>
                    {row.dtrLive ? '✓ Yes' : '✗ No'}
                  </td>
                  <td>
                    <PatternBadge variant={row.patternBadge} label={row.pattern} />
                  </td>
                  <td>
                    <div
                      className="flex items-center justify-center rounded-full border-2 font-mono font-extrabold"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: 9,
                        background: `${riskColor}18`,
                        borderColor: riskColor,
                        color: riskColor,
                      }}
                    >
                      {row.risk}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Pattern badge — matches prototype's `badge-confirmed` (red) / `badge-assigned` (amber). */
function PatternBadge({ variant, label }: { variant: OutageBadgeVariant; label: string }) {
  const color = variant === 'confirmed' ? 'var(--red)' : 'var(--amber)'
  return (
    <span
      className="inline-block whitespace-nowrap rounded-[10px] border px-2 py-[3px] text-[10px] font-semibold"
      style={{ background: `${color}18`, color, borderColor: `${color}55` }}
    >
      {label}
    </span>
  )
}
