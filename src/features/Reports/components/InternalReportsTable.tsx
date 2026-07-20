import type { InternalReport, ReportId } from '../types'

interface InternalReportsTableProps {
  reports: InternalReport[]
  onRun: (id: ReportId) => void
  onEdit: (r: InternalReport) => void
}

/**
 * Section B · scheduled internal reports.
 *   Wide table (min-width 900) inside a horizontal-scroll wrapper so tablets
 *   & mobile can pan. Paused rows render dimmed. `[&_th]` / `[&_td]` are the
 *   arbitrary-selector translation of the prototype's per-cell CSS.
 */
export function InternalReportsTable({ reports, onRun, onEdit }: InternalReportsTableProps) {
  return (
    <div className="card !p-0 mb-[18px] overflow-hidden">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table
          className={
            'w-full border-collapse text-[11.5px] min-w-[900px] ' +
            "[&_thead_tr]:bg-[var(--bg)] [&_thead_tr]:border-b [&_thead_tr]:border-b-[var(--border)] " +
            "[&_th]:py-[9px] [&_th]:px-[14px] [&_th]:text-left [&_th]:text-[var(--text-dim)] [&_th]:font-semibold [&_th]:text-[9.5px] [&_th]:tracking-[0.4px] [&_th]:uppercase " +
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-b-[var(--border-light)] " +
            "[&_td]:py-[11px] [&_td]:px-[14px] [&_td]:align-top [&_td]:text-[var(--text-mid)] [&_td]:text-[10.5px]"
          }
        >
          <thead>
            <tr>
              <th>Report</th>
              <th>Frequency</th>
              <th>Channel</th>
              <th>Recipients</th>
              <th>Next run</th>
              <th className="!text-center">Status</th>
              <th className="!text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className={r.status === 'Paused' ? 'opacity-[0.65]' : undefined}>
                <td>
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[15px]">{r.icon}</span>
                    <strong className="text-[var(--text)] text-[12px]">{r.name}</strong>
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)] mt-[2px] ml-[24px]">Last: {r.last}</div>
                </td>
                <td>{r.freq}</td>
                <td>{r.channel}</td>
                <td>{r.recipients}</td>
                <td className="!font-['JetBrains_Mono',_ui-monospace,_monospace] !text-[var(--text)]">
                  {r.next}
                </td>
                <td className="!text-center">
                  <span
                    className={
                      'py-[2px] px-[9px] rounded-[11px] text-[9.5px] font-bold tracking-[0.3px] whitespace-nowrap inline-block ' +
                      (r.status === 'Active'
                        ? 'bg-[rgba(40,167,69,0.12)] text-[var(--green)]'
                        : 'bg-[rgba(108,117,125,0.15)] text-[var(--text-dim)]')
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="!text-right whitespace-nowrap">
                  <button
                    type="button"
                    className="py-[4px] px-[10px] bg-transparent text-[var(--ai-purple)] border border-[rgba(124,58,237,0.3)] rounded-[5px] text-[10px] font-bold cursor-pointer mr-[4px] hover:bg-[var(--ai-purple-light)]"
                    onClick={() => onRun(r.id)}
                  >
                    Run now
                  </button>
                  <button
                    type="button"
                    className="py-[4px] px-[10px] bg-transparent text-[var(--text-mid)] border border-[var(--border)] rounded-[5px] text-[10px] font-semibold cursor-pointer hover:bg-[var(--bg-soft)]"
                    onClick={() => onEdit(r)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
