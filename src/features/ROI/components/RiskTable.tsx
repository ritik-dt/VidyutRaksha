import type { RiskRow } from '../types'

interface RiskTableProps {
  risks: RiskRow[]
}

/** Likelihood pill bg colour by tone. */
function likelihoodColor(tone: string): string {
  switch (tone) {
    case 'green': return 'var(--green)'
    case 'amber': return 'var(--amber)'
    case 'red':   return 'var(--red)'
    default:      return 'var(--text-dim)'
  }
}

/**
 * "What could go wrong" risk table with colored likelihood pills.
 *   Columns: Risk (bold) · Likelihood (pill) · Impact (mid text) · Mitigation.
 *   Horizontal scroll wrapper for mobile.
 */
export function RiskTable({ risks }: RiskTableProps) {
  return (
    <div className="card mb-[14px]">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table
          className={
            'w-full border-collapse text-[11.5px] min-w-[560px] max-[480px]:min-w-[460px] ' +
            "[&_thead_tr]:border-b [&_thead_tr]:border-b-[var(--border)] " +
            "[&_th]:text-left [&_th]:py-[7px] [&_th]:px-[9px] [&_th]:text-[9.5px] [&_th]:font-bold [&_th]:text-[var(--text-dim)] [&_th]:uppercase " +
            "max-[640px]:[&_th]:!p-[6px] max-[640px]:[&_th]:!text-[8.5px] " +
            "max-[480px]:[&_th]:!p-[5px] max-[480px]:[&_th]:!text-[8px] " +
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-b-[var(--border-light)] " +
            "[&_td]:py-[9px] [&_td]:px-[9px] " +
            "max-[640px]:[&_td]:!p-[6px] max-[640px]:[&_td]:!text-[10.5px] " +
            "max-[480px]:[&_td]:!p-[5px] max-[480px]:[&_td]:!text-[10px]"
          }
        >
          <thead>
            <tr>
              <th>Risk</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.risk}>
                <td className="font-semibold text-[var(--text)] break-words">{r.risk}</td>
                <td>
                  <span
                    className="inline-block py-[1px] px-[8px] text-white rounded-[9px] text-[9.5px] font-bold whitespace-nowrap"
                    style={{ background: likelihoodColor(r.likelihoodTone) }}
                  >
                    {r.likelihood}
                  </span>
                </td>
                <td className="text-[var(--text-mid)]">{r.impact}</td>
                <td className="text-[var(--text-mid)] text-[10.5px] leading-[1.45] break-words">
                  {r.mitigation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
