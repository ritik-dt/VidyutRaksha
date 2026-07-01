import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesWatchlistItem } from './types'

interface CasesSlaWatchlistProps {
  scopeName: string
  items: CasesWatchlistItem[]
  totalPastSla?: number
}

const thBase = 'px-2.5 py-2 text-[9.5px] font-bold tracking-[0.5px] uppercase'

export function CasesSlaWatchlist({ scopeName, items, totalPastSla }: CasesSlaWatchlistProps) {
  const { showToast } = useToast()

  /* ── empty state ─────────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="card mt-3.5" style={{ borderLeft: '3px solid var(--green)' }}>
        <div className="card-title flex items-center justify-between">
          <span>✅ SLA breach watchlist · {scopeName}</span>
          <span className="text-[10.5px] font-semibold text-green">All clear at this scope</span>
        </div>
        <div className="p-4.5 text-center text-[11.5px] text-text-mid">
          <div className="mb-1.5 text-[28px] opacity-50">🎯</div>
          No active cases are past SLA at <strong>{scopeName}</strong>.
          Inspector closure rate is meeting the 3-day target.
        </div>
      </div>
    )
  }

  const totalExposure = items.reduce((s, c) => s + c.estValue, 0)
  const moreCases = (totalPastSla && totalPastSla > items.length) ? totalPastSla - items.length : 0
  const qualifyCount = items.filter((c) => (c.overdueDays ?? 0) >= 2).length

  return (
    <div className="card mt-3.5" style={{ borderLeft: '3px solid var(--red)' }}>
      {/* ── HEADER ── */}
      <div className="card-title flex items-center justify-between">
        <span>
          🔥 SLA breach watchlist · {scopeName} · top {items.length}
          {totalPastSla && totalPastSla > items.length ? ` of ${formatIndian(totalPastSla)}` : ''}
        </span>
        <span className="text-[10.5px] font-normal text-text-dim">
          ranked by overdue days × est. value · {fmtINR(totalExposure)} combined exposure
        </span>
      </div>

      {/* ── SUB DESCRIPTION ── */}
      <div className="page-sub my-[-2px] mb-2.5 text-[10.5px]">
        Cases past due date in this scope's territory — escalation recommended.
        Production wiring would auto-page next-level supervisor after 48h overdue.
      </div>

      {/* ── TABLE ── */}
      <table className="w-full border-collapse text-[11.5px]">
        <thead>
          <tr className="border-b border-border bg-bg-soft">
            <th className={`${thBase} text-left text-text-mid`}>Risk</th>
            <th className={`${thBase} text-left text-text-mid`}>Case · Consumer</th>
            <th className={`${thBase} text-left text-text-mid`}>Inspector</th>
            <th className={`${thBase} text-right text-red`}>Overdue</th>
            <th className={`${thBase} text-right text-text-mid`}>Est. value</th>
            <th className={`${thBase} text-center text-text-mid`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => {
            const riskTier = c.risk >= 80 ? 'high' : c.risk >= 60 ? 'mid' : 'low'
            const riskClasses =
              riskTier === 'high'
                ? 'border-[#DC3545] bg-[rgba(220,53,69,0.08)] text-[#DC3545]'
                : riskTier === 'mid'
                  ? 'border-[#E6921E] bg-[rgba(230,146,30,0.08)] text-[#E6921E]'
                  : 'border-[var(--amber-dark)] bg-[rgba(180,117,24,0.08)] text-[var(--amber-dark)]'
            const consumerShort =
              (c.consumer || '').length > 26
                ? c.consumer.substring(0, 26) + '…'
                : c.consumer

            return (
              <tr
                key={c.id}
                className="cursor-pointer border-b border-border-light transition-colors duration-150 hover:bg-bg-soft"
                onClick={() =>
                  showToast({
                    type: 'info',
                    title: 'Case details',
                    message: `In production this would open the case detail page for ${c.id}.`,
                    duration: 4000,
                  })
                }
              >
                {/* RISK */}
                <td className="p-2.5">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-[7px] border-2 font-mono text-[11px] font-extrabold ${riskClasses}`}>
                    {c.risk}
                  </div>
                </td>

                {/* CASE · CONSUMER */}
                <td className="p-2.5">
                  <div className="font-mono text-[10.5px] font-bold text-id-text">
                    {c.id}
                  </div>
                  <div className="mt-0.5 text-[11.5px] font-semibold text-text">
                    {consumerShort}
                  </div>
                  <div className="mt-px text-[9.5px] text-text-dim">
                    {c._activity} · {c._load}{c._load_unit}
                  </div>
                </td>

                {/* INSPECTOR */}
                <td className="p-2.5 text-[10.5px] text-text-mid">
                  {c.assignee || '—'}
                </td>

                {/* OVERDUE */}
                <td className="p-2.5 text-right">
                  <span className="inline-block rounded-[5px] border border-[rgba(220,53,69,0.3)] bg-[rgba(220,53,69,0.1)] px-2 py-[3px] text-[10.5px] font-extrabold text-red">
                    ⚠ {c.overdueDays}d
                  </span>
                </td>

                {/* EST. VALUE */}
                <td className="p-2.5 text-right font-mono font-semibold text-ai-purple">
                  {fmtINR(c.estValue)}
                </td>

                {/* ACTION */}
                <td className="p-2.5 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        showToast({
                          type: 'success',
                          title: 'Escalated',
                          message: `Case ${c.id} escalated to next-level supervisor.`,
                          duration: 4000,
                        })
                      }}
                      className="cursor-pointer rounded-[5px] border-none bg-[linear-gradient(135deg,#FF4757_0%,#A8222F_100%)] px-2.5 py-[3px] text-[10px] font-bold text-white"
                    >
                      ⚠ Escalate
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        showToast({
                          type: 'info',
                          title: 'Reassign requested',
                          message: `Case ${c.id} flagged for inspector reassignment.`,
                          duration: 4000,
                        })
                      }}
                      className="cursor-pointer rounded-[5px] border border-border bg-transparent px-2.5 py-[3px] text-[10px] font-semibold text-text-mid"
                    >
                      Reassign
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* ── AI FOOTER ── */}
      <div className="mt-3 rounded-[7px] bg-ai-purple-light p-2.5 px-3 text-[10.5px] leading-[1.5] text-ai-purple">
        <strong>✦ AI:</strong> The combined exposure on past-SLA cases shown is{' '}
        <strong>{fmtINR(totalExposure)}</strong>.{' '}
        {moreCases > 0 && totalPastSla ? (
          <>
            Total past-SLA at this scope:{' '}
            <strong>{formatIndian(totalPastSla)} cases</strong>{' '}
            — {formatIndian(moreCases)} more not shown.{' '}
          </>
        ) : null}
        Auto-escalation policy would trigger next-level supervisor notification
        after 48h overdue — {qualifyCount} cases qualify.
      </div>
    </div>
  )
}
