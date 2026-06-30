import { useState } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesWatchlistItem } from './types'

interface CasesSlaWatchlistProps {
  scopeName: string
  items: CasesWatchlistItem[]
  totalPastSla?: number
}

export function CasesSlaWatchlist({ scopeName, items, totalPastSla }: CasesSlaWatchlistProps) {
  const { showToast } = useToast()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  /* ── empty state ─────────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div
        className="card"
        style={{ marginTop: 14, borderLeft: '3px solid var(--green)' }}
      >
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>✅ SLA breach watchlist · {scopeName}</span>
          <span style={{ fontSize: 10.5, color: 'var(--green)', fontWeight: 600 }}>All clear at this scope</span>
        </div>
        <div style={{ padding: 18, textAlign: 'center', color: 'var(--text-mid)', fontSize: 11.5 }}>
          <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.5 }}>🎯</div>
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
    <div
      className="card"
      style={{ marginTop: 14, borderLeft: '3px solid var(--red)' }}
    >
      {/* ── HEADER ── */}
      <div
        className="card-title"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span>
          🔥 SLA breach watchlist · {scopeName} · top {items.length}
          {totalPastSla && totalPastSla > items.length ? ` of ${formatIndian(totalPastSla)}` : ''}
        </span>
        <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 400 }}>
          ranked by overdue days × est. value · {fmtINR(totalExposure)} combined exposure
        </span>
      </div>

      {/* ── SUB DESCRIPTION ── */}
      <div className="page-sub" style={{ margin: '-2px 0 10px', fontSize: 10.5 }}>
        Cases past due date in this scope's territory — escalation recommended.
        Production wiring would auto-page next-level supervisor after 48h overdue.
      </div>

      {/* ── TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr style={{ background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
            <th style={th('left')}>Risk</th>
            <th style={th('left')}>Case · Consumer</th>
            <th style={th('left')}>Inspector</th>
            <th style={th('right', 'var(--red)')}>Overdue</th>
            <th style={th('right')}>Est. value</th>
            <th style={th('center')}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => {
            const col =
              c.risk >= 80 ? '#DC3545'
              : c.risk >= 60 ? '#E6921E'
              : 'var(--amber-dark)'
            const colBg =
              c.risk >= 80 ? 'rgba(220,53,69,0.08)'
              : c.risk >= 60 ? 'rgba(230,146,30,0.08)'
              : 'rgba(180,117,24,0.08)'
            const consumerShort =
              (c.consumer || '').length > 26
                ? c.consumer.substring(0, 26) + '…'
                : c.consumer
            const isHovered = hoveredRow === c.id

            return (
              <tr
                key={c.id}
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  background: isHovered ? 'var(--bg-soft)' : 'transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={() => setHoveredRow(c.id)}
                onMouseLeave={() => setHoveredRow(null)}
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
                <td style={{ padding: 10 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 7,
                      background: colBg,
                      border: `2px solid ${col}`,
                      color: col,
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    {c.risk}
                  </div>
                </td>

                {/* CASE · CONSUMER */}
                <td style={{ padding: 10 }}>
                  <div style={{ fontSize: 10.5, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--id-text)' }}>
                    {c.id}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--text)', marginTop: 2 }}>
                    {consumerShort}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-dim)', marginTop: 1 }}>
                    {c._activity} · {c._load}{c._load_unit}
                  </div>
                </td>

                {/* INSPECTOR */}
                <td style={{ padding: 10, fontSize: 10.5, color: 'var(--text-mid)' }}>
                  {c.assignee || '—'}
                </td>

                {/* OVERDUE */}
                <td style={{ padding: 10, textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      background: 'rgba(220,53,69,0.1)',
                      color: 'var(--red)',
                      border: '1px solid rgba(220,53,69,0.3)',
                      borderRadius: 5,
                      fontSize: 10.5,
                      fontWeight: 800,
                    }}
                  >
                    ⚠ {c.overdueDays}d
                  </span>
                </td>

                {/* EST. VALUE */}
                <td
                  style={{
                    padding: 10,
                    textAlign: 'right',
                    fontFamily: 'var(--mono)',
                    fontWeight: 600,
                    color: 'var(--ai-purple)',
                  }}
                >
                  {fmtINR(c.estValue)}
                </td>

                {/* ACTION */}
                <td style={{ padding: 10, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
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
                      style={{
                        padding: '3px 9px',
                        background: 'linear-gradient(135deg,#FF4757 0%,#A8222F 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
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
                      style={{
                        padding: '3px 9px',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 5,
                        fontSize: 10,
                        fontWeight: 600,
                        color: 'var(--text-mid)',
                        cursor: 'pointer',
                      }}
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
      <div
        style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'var(--ai-purple-light)',
          borderRadius: 7,
          fontSize: 10.5,
          color: 'var(--ai-purple)',
          lineHeight: 1.5,
        }}
      >
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

function th(
  align: 'left' | 'right' | 'center',
  color = 'var(--text-mid)',
): React.CSSProperties {
  return {
    padding: '8px 10px',
    textAlign: align,
    fontSize: 9.5,
    fontWeight: 700,
    color,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }
}
