import { useToast } from '@/shared/context/ToastContext'
import { useRole } from '@/shared/context/RoleContext'
import type { ExcessDemandConsumer } from '../logic/excessDemand'
import { computeExcessDemandStats } from '../logic/excessDemand'
import { DtSectionHeader } from './DtSectionHeader'

interface ExcessDemandSectionProps {
  excessDemand: ExcessDemandConsumer[]
  onSelectMeter?: (meter: string) => void
}

const EXCESS_LIMIT = 12

/** Status → badge class (matches Cases module badge naming). */
function statusBadgeClass(status: ExcessDemandConsumer['status']): string {
  if (status === 'Recovered') return 'badge badge-confirmed'
  if (status === 'Notice issued') return 'badge badge-assigned'
  return 'badge badge-new'
}

export function ExcessDemandSection({
  excessDemand,
  onSelectMeter,
}: ExcessDemandSectionProps) {
  const { showToast } = useToast()
  const { currentRole } = useRole()
  const stats = computeExcessDemandStats(excessDemand)
  const visible = excessDemand.slice(0, EXCESS_LIMIT)
  const roleLabel = (currentRole?.label || 'all').replace(/[^A-Za-z0-9]/g, '_')

  return (
    <div id="excess-demand-section" className="mt-[24px]">
      <DtSectionHeader
        dotColor="var(--amber)"
        labelColor="var(--amber)"
        label={`Excess demand consumers · ${excessDemand.length}`}
        desc="Consumers drawing peak load above their sanctioned demand — UPERC surcharge applicable"
        topMargin="none"
      />
      <div className="card">
        {/* dt-excess-summary — flex row → flex col at ≤640 */}
        <div className="flex justify-between items-center flex-wrap gap-[10px] mb-[12px] max-[640px]:flex-col max-[640px]:!items-stretch max-[640px]:!gap-[12px]">
          {/* dt-excess-stats */}
          <div className="flex gap-[14px] text-[11px] flex-wrap max-[640px]:!gap-[10px] max-[640px]:!text-[10.5px]">
            <div>
              <span className="text-[var(--text-dim)]">Total recoverable: </span>
              <strong className="text-[var(--amber)] font-mono">
                ₹{(stats.totalSurcharge / 100000).toFixed(2)} L
              </strong>{' '}
              <span className="text-[var(--text-dim)] text-[10px]">
                / month
              </span>
            </div>
            <div>
              <span className="text-[var(--text-dim)]">Notice issued: </span>
              <strong className="font-mono" style={{ color: 'var(--id-text, #0284c7)' }}>
                {stats.noticeIssued}
              </strong>
            </div>
            <div>
              <span className="text-[var(--text-dim)]">Recovered: </span>
              <strong className="text-[var(--green)] font-mono">
                {stats.recovered}
              </strong>
            </div>
            <div>
              <span className="text-[var(--text-dim)]">Pending: </span>
              <strong className="text-[var(--red)] font-mono">
                {stats.pending}
              </strong>
            </div>
          </div>
          {/* dt-excess-actions */}
          <div className="flex gap-[6px] flex-wrap max-[640px]:w-full max-[640px]:[&>button]:flex-1 max-[640px]:[&>button]:min-w-[140px]">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: 11 }}
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'CSV exported',
                  message: `${excessDemand.length} excess-demand consumer rows exported. File: excess_demand_${roleLabel}.csv`,
                  duration: 3500,
                })
              }
            >
              📄 Export CSV
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              style={{ fontSize: 11 }}
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'Bulk notices drafted',
                  message: `AI prepared ${stats.pending} demand-surcharge notices for review. Each cites the specific KW excess and applicable UPERC clause.`,
                  duration: 4500,
                })
              }
            >
              ✦ Auto-draft notices
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Consumer</th>
                <th>Activity</th>
                <th>Tariff</th>
                <th style={{ textAlign: 'right' }}>Sanctioned</th>
                <th style={{ textAlign: 'right' }}>Peak demand</th>
                <th style={{ textAlign: 'right' }}>Excess</th>
                <th style={{ textAlign: 'right' }}>Surcharge / mo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => {
                const peakColor =
                  e.excessPct > 50 ? 'var(--red)' : 'var(--amber)'
                return (
                  <tr
                    key={e.meter}
                    className="table-row cursor-pointer"
                    onClick={() => onSelectMeter?.(e.meter)}
                  >
                    <td>
                      <div className="font-semibold text-[12px]">{e.name}</div>
                      <div
                        className="text-[10px] text-[var(--text-dim)] font-mono"
                      >
                        #{e.meter}
                      </div>
                    </td>
                    <td className="text-[11px] text-[var(--text-mid)]">
                      {e.activity}
                    </td>
                    <td className="text-[11px] text-[var(--text-mid)]">
                      LMV-{e.tariff}
                    </td>
                    <td className="font-mono text-[11.5px] text-right">
                      {e.sanctioned} KW
                    </td>
                    <td
                      className="font-mono text-[11.5px] font-bold text-right"
                      style={{ color: peakColor }}
                    >
                      {e.peak} KW
                    </td>
                    <td className="font-mono text-[11.5px] text-right">
                      <span
                        className="font-bold"
                        style={{ color: peakColor }}
                      >
                        +{e.excessKW} KW
                      </span>{' '}
                      <span className="text-[var(--text-dim)] text-[10px] ml-[4px]">
                        (+{e.excessPct}%)
                      </span>
                    </td>
                    <td
                      className="font-mono text-[11.5px] font-bold text-right text-[var(--amber)]"
                    >
                      ₹{e.surcharge.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span
                        className={statusBadgeClass(e.status)}
                        style={{ fontSize: 10 }}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {excessDemand.length > EXCESS_LIMIT && (
          <div className="mt-[10px] py-[8px] px-[10px] bg-[var(--bg)] rounded-[6px] text-[11px] text-[var(--text-mid)] text-center">
            Showing top {EXCESS_LIMIT} of{' '}
            <strong>{excessDemand.length}</strong> excess-demand consumers
            (sorted by % over sanctioned). Use Export CSV for the full list.
          </div>
        )}
      </div>
    </div>
  )
}
