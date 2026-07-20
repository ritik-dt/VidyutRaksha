import type { Addressable, LossBucket, LossTotal } from '../types'

interface LossBreakdownTableProps {
  buckets: LossBucket[]
  total: LossTotal
}

const ADDR_LABEL: Record<Addressable, string> = {
  yes: '✓ YES',
  partial: 'PARTIAL',
  no: '— NO',
}

/** Colour tokens for the AI-addressable badge. */
function addrBadgeStyles(v: Addressable): { bg: string; color: string; border: string } {
  switch (v) {
    case 'yes':     return { bg: 'rgba(40,167,69,0.1)',  color: 'var(--green)',    border: 'rgba(40,167,69,0.3)' }
    case 'partial': return { bg: 'rgba(230,146,30,0.1)', color: 'var(--amber-dark)', border: 'rgba(230,146,30,0.3)' }
    case 'no':      return { bg: 'rgba(0,0,0,0.04)',    color: 'var(--text-dim)', border: 'var(--border)' }
  }
}

/**
 * "Where the ₹9,676 Cr goes" table with AI-addressable badges + total row.
 *   • Table body uses shared table pattern with `[&_th]:` / `[&_td]:` selectors.
 *   • Total row uses purple tint with 2px top border (prototype's total-row).
 *   • Horizontal scroll wrapper wraps the table for mobile.
 */
export function LossBreakdownTable({ buckets, total }: LossBreakdownTableProps) {
  return (
    <div className="card mb-[14px]">
      <div className="card-title">Where the ₹9,676 Cr goes</div>
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
              <th>Loss bucket</th>
              <th className="!text-right">₹ Cr · annual</th>
              <th className="!text-right">Share</th>
              <th>AI addressable?</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((b) => {
              const s = addrBadgeStyles(b.addressable)
              return (
                <tr key={b.bucket}>
                  <td className="font-semibold text-[var(--text)] break-words">{b.bucket}</td>
                  <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace] font-bold text-[var(--text)]">
                    {b.value}
                  </td>
                  <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace] text-[var(--text-mid)]">
                    {b.share}
                  </td>
                  <td>
                    <span
                      className="inline-flex items-center gap-[4px] py-[2px] px-[8px] rounded-[10px] text-[10px] font-bold border whitespace-nowrap"
                      style={{ background: s.bg, color: s.color, borderColor: s.border }}
                    >
                      {ADDR_LABEL[b.addressable]}
                    </span>
                    <span className="text-[10.5px] text-[var(--text-mid)] ml-[6px] break-words">
                      {b.note}
                    </span>
                  </td>
                </tr>
              )
            })}
            <tr
              className="[&_td]:!text-[var(--ai-purple)] font-extrabold"
              style={{
                background: 'rgba(124,58,237,0.04)',
                borderTop: '2px solid var(--ai-purple)',
              }}
            >
              <td>{total.label}</td>
              <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace]">{total.value}</td>
              <td className="!text-right font-['JetBrains_Mono',_ui-monospace,_monospace]">{total.share}</td>
              <td className="!text-[10.5px]">{total.note}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
