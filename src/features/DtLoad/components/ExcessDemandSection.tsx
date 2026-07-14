import { useToast } from '@/shared/context/ToastContext'
import { useRole } from '@/shared/context/RoleContext'
import type { ExcessDemandConsumer } from '../logic/excessDemand'
import { computeExcessDemandStats } from '../logic/excessDemand'

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

export function ExcessDemandSection({ excessDemand, onSelectMeter }: ExcessDemandSectionProps) {
  const { showToast } = useToast()
  const { currentRole } = useRole()
  const stats = computeExcessDemandStats(excessDemand)
  const visible = excessDemand.slice(0, EXCESS_LIMIT)
  const roleLabel = (currentRole?.label || 'all').replace(/[^A-Za-z0-9]/g, '_')

  return (
    <div id="excess-demand-section" style={{ marginTop: 24 }}>
      <div className="dt-section-header" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 10px', flexWrap: 'wrap' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)' }} />
        <div
          className="dt-section-label"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--amber)',
            textTransform: 'uppercase',
            letterSpacing: '.6px',
          }}
        >
          Excess demand consumers · {excessDemand.length}
        </div>
        <div className="dt-section-desc" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          Consumers drawing peak load above their sanctioned demand — UPERC surcharge applicable
        </div>
      </div>
      <div className="card">
        <div
          className="dt-excess-summary"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div className="dt-excess-stats" style={{ display: 'flex', gap: 14, fontSize: 11, flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Total recoverable: </span>
              <strong style={{ color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                ₹{(stats.totalSurcharge / 100000).toFixed(2)} L
              </strong>{' '}
              <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>/ month</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Notice issued: </span>
              <strong style={{ color: 'var(--id-text, #0284c7)', fontFamily: 'var(--mono)' }}>
                {stats.noticeIssued}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Recovered: </span>
              <strong style={{ color: 'var(--green)', fontFamily: 'var(--mono)' }}>{stats.recovered}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Pending: </span>
              <strong style={{ color: 'var(--red)', fontFamily: 'var(--mono)' }}>{stats.pending}</strong>
            </div>
          </div>
          <div className="dt-excess-actions" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
                const peakColor = e.excessPct > 50 ? 'var(--red)' : 'var(--amber)'
                return (
                  <tr
                    key={e.meter}
                    className="table-row"
                    onClick={() => onSelectMeter?.(e.meter)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{e.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                        #{e.meter}
                      </div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-mid)' }}>{e.activity}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-mid)' }}>LMV-{e.tariff}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, textAlign: 'right' }}>
                      {e.sanctioned} KW
                    </td>
                    <td
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: peakColor,
                        textAlign: 'right',
                      }}
                    >
                      {e.peak} KW
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 11.5, textAlign: 'right' }}>
                      <span style={{ color: peakColor, fontWeight: 700 }}>+{e.excessKW} KW</span>{' '}
                      <span style={{ color: 'var(--text-dim)', fontSize: 10, marginLeft: 4 }}>
                        (+{e.excessPct}%)
                      </span>
                    </td>
                    <td
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: 'var(--amber)',
                        textAlign: 'right',
                      }}
                    >
                      ₹{e.surcharge.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={statusBadgeClass(e.status)} style={{ fontSize: 10 }}>
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
          <div
            style={{
              marginTop: 10,
              padding: '8px 10px',
              background: 'var(--bg)',
              borderRadius: 6,
              fontSize: 11,
              color: 'var(--text-mid)',
              textAlign: 'center',
            }}
          >
            Showing top {EXCESS_LIMIT} of <strong>{excessDemand.length}</strong> excess-demand consumers (sorted
            by % over sanctioned). Use Export CSV for the full list.
          </div>
        )}
      </div>
    </div>
  )
}
