import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesWatchlistItem } from './types'

interface CasesSlaWatchlistProps {
  scopeName: string
  items: CasesWatchlistItem[]
}

export function CasesSlaWatchlist({ scopeName, items }: CasesSlaWatchlistProps) {
  const { showToast } = useToast()

  if (items.length === 0) {
    return (
      <div className="card mt-4 border-l-[3px] border-l-green-500">
        <div className="card-title flex items-center justify-between">
          <span>✅ SLA breach watchlist · {scopeName}</span>
          <span className="text-[10.5px] font-semibold text-green-600">All clear at this scope</span>
        </div>
        <div className="px-4 py-8 text-center text-[11.5px] text-text-mid">
          No active cases are past SLA at <strong>{scopeName}</strong>.
        </div>
      </div>
    )
  }

  const totalExposure = items.reduce((sum, item) => sum + item.estValue, 0)

  return (
    <div className="card mt-4 border-l-[3px] border-l-red-500">
      <div className="card-title flex items-center justify-between">
        <span>🔥 SLA breach watchlist · {scopeName} · top {formatIndian(items.length)}</span>
        <span className="text-[10.5px] font-normal text-text-dim">
          ranked by overdue days × est. value · {fmtINR(totalExposure)} combined exposure
        </span>
      </div>
      <div className="page-sub mb-2 text-[10.5px]">
        Cases past due date in this scope's territory - escalation recommended.
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-[11.5px]">
          <thead>
            <tr className="bg-[#dbe6f5]">
              <th className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-mid">Risk</th>
              <th className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-mid">Case · Consumer</th>
              <th className="px-3 py-2 text-left text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-mid">Inspector</th>
              <th className="px-3 py-2 text-right text-[9.5px] font-bold uppercase tracking-[0.5px] text-red-500">Overdue</th>
              <th className="px-3 py-2 text-right text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-mid">Est. value</th>
              <th className="px-3 py-2 text-center text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-mid">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const riskColor = item.risk >= 80 ? '#DC3545' : item.risk >= 60 ? '#E6921E' : '#B47518'
              const riskBg = item.risk >= 80 ? 'rgba(220,53,69,0.08)' : item.risk >= 60 ? 'rgba(230,146,30,0.08)' : 'rgba(180,117,24,0.08)'

              return (
                <tr key={item.id} className="border-t border-border-light">
                  <td className="px-3 py-3">
                    <div
                      className="flex size-[34px] items-center justify-center rounded-lg border-2 font-mono text-[10px] font-extrabold"
                      style={{ background: riskBg, borderColor: riskColor, color: riskColor }}
                    >
                      {item.risk}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-mono text-[10.5px] font-bold text-id-text">{item.id}</div>
                    <div className="mt-0.5 font-semibold text-text">{item.consumer}</div>
                    <div className="text-[9.5px] text-text-dim">{item.category}</div>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-text-mid">{item.assignee}</td>
                  <td className="px-3 py-3 text-right font-mono text-[11px] font-semibold text-red-500">
                    {item.overdueDays}d
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-[11px] font-semibold" style={{ color: 'var(--ai-purple)' }}>
                    {fmtINR(item.estValue)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="btn btn-ai btn-sm"
                        style={{ padding: '3px 10px', fontSize: '10px' }}
                        onClick={() =>
                          showToast({
                            type: 'info',
                            title: 'Reassign inspector',
                            message: `Open the case flow for ${item.consumer} in ${scopeName}.`,
                            duration: 3500,
                          })
                        }
                      >
                        Reassign
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 10px', fontSize: '10px' }}
                        onClick={() =>
                          showToast({
                            type: 'success',
                            title: 'Escalate',
                            message: `${item.id} queued for supervisor escalation.`,
                            duration: 3500,
                          })
                        }
                      >
                        Escalate
                      </button>
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

