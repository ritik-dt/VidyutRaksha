import type { NotificationFilter, NotificationStats } from '../types'

interface NotificationsKpiStripProps {
  stats: NotificationStats
  avgResponseMinutes: number
  onFilter: (filter: NotificationFilter) => void
}

/** 5-KPI strip — exact port (Unread / Avg response / Mentions / Assignments / Reminders). */
export function NotificationsKpiStrip({
  stats,
  avgResponseMinutes,
  onFilter,
}: NotificationsKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onFilter({ read: 'false' })}>
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Unread</div>
        <div className="kpi-value" style={{ color: 'var(--ai-purple)' }}>{stats.unread}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #64748b)' }} />
        <div className="kpi-label">Avg response time</div>
        <div className="kpi-value">{avgResponseMinutes} min</div>
        <div className="kpi-sub">Target: 30 min ✓</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ type: 'mention' })}>
        <div className="kpi-accent" style={{ background: 'var(--ai-purple)' }} />
        <div className="kpi-label">Mentions</div>
        <div className="kpi-value">{stats.mentions}</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ type: 'assignment' })}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">New assignments</div>
        <div className="kpi-value">{stats.assignments}</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Reminders</div>
        <div className="kpi-value">{stats.reminders}</div>
        <div className="kpi-sub">Due today/tomorrow</div>
      </div>
    </div>
  )
}
