import type { NoticeStats, NoticesFilter } from '../types'

interface NoticesKpiStripProps {
  stats: NoticeStats
  onFilter: (filter: NoticesFilter) => void
}

/** 5-KPI strip — exact port (Drafts / Sent / Payments / Appeals / Amount). */
export function NoticesKpiStrip({ stats, onFilter }: NoticesKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Drafts ready</div>
        <div className="kpi-value">{stats.draftsReady}</div>
        <div className="kpi-sub">Awaiting review</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'sent' })}>
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Sent this month</div>
        <div className="kpi-value">{stats.sentThisMonth}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Payment received</div>
        <div className="kpi-value">{stats.paymentReceived}</div>
        <div className="kpi-sub">{stats.paymentResponseRate}% response rate</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Under appeal</div>
        <div className="kpi-value">{stats.underAppeal}</div>
        <div className="kpi-sub">{stats.contestedRate}% contested</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Amount billed</div>
        <div className="kpi-value">₹{stats.amountBilledCr} Cr</div>
        <div className="kpi-sub">Month-to-date</div>
      </div>
    </div>
  )
}
