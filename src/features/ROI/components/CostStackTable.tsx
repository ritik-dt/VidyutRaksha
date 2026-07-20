import type { CostRow, CostTotal } from '../types'

interface CostStackTableProps {
  rows: CostRow[]
  total: CostTotal
  note: string
}

/**
 * 5-year cost stack table with a red-tinted total row + note box below.
 * The total row uses `background: rgba(220,53,69,0.04)` and
 * `border-top: 2px solid var(--red)` (was `.roi-cost-total`).
 */
export function CostStackTable({ rows, total, note }: CostStackTableProps) {
  return (
    <div className="card">
      <div className="card-title">5-year cost stack (₹ Cr)</div>
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table
          className={
            'w-full border-collapse text-[11px] min-w-[440px] mt-[6px] max-[480px]:min-w-[380px] ' +
            "[&_thead_tr]:border-b [&_thead_tr]:border-b-[var(--border)] " +
            "[&_th]:text-left [&_th]:py-[6px] [&_th]:px-[8px] [&_th]:text-[9.5px] [&_th]:font-bold [&_th]:text-[var(--text-dim)] [&_th]:uppercase " +
            "max-[640px]:[&_th]:!p-[6px] max-[640px]:[&_th]:!text-[8.5px] " +
            "max-[480px]:[&_th]:!p-[5px] max-[480px]:[&_th]:!text-[8px] " +
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-b-[var(--border-light)] " +
            "[&_td]:py-[8px] [&_td]:px-[8px] " +
            "max-[640px]:[&_td]:!p-[6px] max-[640px]:[&_td]:!text-[10.5px] " +
            "max-[480px]:[&_td]:!p-[5px] max-[480px]:[&_td]:!text-[10px]"
          }
        >
          <thead>
            <tr>
              <th>Cost head</th>
              <th className="!text-right">Yr 1</th>
              <th className="!text-right">Yr 2</th>
              <th className="!text-right">Yr 3-5</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cost}>
                <td className="text-[var(--text)] break-words">{r.cost}</td>
                <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace] font-semibold">{r.y1}</td>
                <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace] font-semibold">{r.y2}</td>
                <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace] font-semibold">{r.y3}</td>
              </tr>
            ))}
            <tr
              className="[&_td]:!text-[var(--red)] font-extrabold"
              style={{
                background: 'rgba(220,53,69,0.04)',
                borderTop: '2px solid var(--red)',
              }}
            >
              <td>{total.label}</td>
              <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace]">{total.y1}</td>
              <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace]">{total.y2}</td>
              <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace]">{total.y3}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="mt-[10px] py-[8px] px-[10px] bg-[var(--bg)] rounded-[6px] text-[10.5px] text-[var(--text-mid)] leading-[1.5] [&_strong]:text-[var(--text)] break-words"
        dangerouslySetInnerHTML={{ __html: note }}
      />
    </div>
  )
}
