import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'

interface Notif {
  id: string; type: string; icon: string; actor: string; action: string
  time: string; read: boolean; context: string; link: string; ageMin: number
}

const NOTIFS: Notif[] = [
  { id: 'N-842', type: 'mention', icon: '💬', actor: 'Rajiv Mehta', action: 'mentioned you in Case C-20260301-001', time: '5 min ago', read: false, context: '"Good work @RajeshKumar. Proceeding with Section 135 notice…"', link: 'cases', ageMin: 5 },
  { id: 'N-841', type: 'assignment', icon: '📋', actor: 'System', action: 'assigned 3 new cases to you', time: '18 min ago', read: false, context: 'Cases C-20260305-019, C-20260305-020, C-20260305-021 in Bhelupur area', link: 'cases', ageMin: 18 },
  { id: 'N-840', type: 'alert', icon: '⚠️', actor: 'AI Engine', action: 'flagged Meter #2034871 as critical (risk 91)', time: '42 min ago', read: false, context: 'Consumption drop 72% + zero night intervals. Bypass suspected.', link: 'meters', ageMin: 42 },
  { id: 'N-839', type: 'sla', icon: '⏰', actor: 'System', action: 'SLA breach warning — 2 cases due in 4 hours', time: '1 hr ago', read: false, context: 'C-20260301-001 and C-20260228-014 approaching deadline', link: 'cases', ageMin: 60 },
  { id: 'N-838', type: 'approval', icon: '✅', actor: 'Rajiv Mehta', action: 'approved your assessment for ₹3,88,800', time: '2 hr ago', read: true, context: 'Case C-20260301-001 · HEERA LAL AGRAWAL · Notice auto-generated', link: 'assessment', ageMin: 120 },
  { id: 'N-837', type: 'cluster', icon: '🕸️', actor: 'AI Engine', action: 'detected coordinated theft cluster in DT-0445', time: '3 hr ago', read: true, context: '12 meters showing synchronized zero-load pattern. Cluster CL-2026-042 created.', link: 'clusters', ageMin: 180 },
  { id: 'N-836', type: 'system', icon: '🤖', actor: 'AI Engine', action: 'completed overnight model retrain', time: '5 hr ago', read: true, context: 'Model v3.4.1 deployed. F1: 0.847. FP rate: 16.2% (↓8pp from v3.3). Detection improving.', link: 'dashboard', ageMin: 300 },
  { id: 'N-835', type: 'report', icon: '📄', actor: 'System', action: 'weekly digest report ready for download', time: 'Yesterday', read: true, context: 'Week 14 summary — 851 new flags, 24 confirmed, ₹2.1L recovered.', link: 'reports', ageMin: 1440 },
]

const TYPE_COLOR: Record<string, string> = {
  mention: '#7C3AED', assignment: '#0EA5E9', alert: '#DC3545',
  sla: '#E6921E', approval: '#22C55E', cluster: '#7C3AED',
  system: '#6B7280', report: '#0EA5E9',
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [readMap, setReadMap] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFS.map((n) => [n.id, n.read]))
  )
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = NOTIFS.filter((n) => !readMap[n.id]).length
  const visible = filter === 'unread' ? NOTIFS.filter((n) => !readMap[n.id]) : NOTIFS

  function markRead(id: string) {
    setReadMap((p: Record<string, boolean>) => ({ ...p, [id]: true }))
  }
  function markAllRead() {
    setReadMap(Object.fromEntries(NOTIFS.map((n) => [n.id, true])))
    showToast({ type: 'success', title: 'All read', message: 'All notifications marked as read.', duration: 2500 })
  }

  return (
    <div className="pb-8">
      <PageHeader
        title="🔔 Notifications"
        subtitle={`${unreadCount} unread · mentions, assignments, AI alerts, and system events`}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={markAllRead}>
              ✓ Mark all read
            </button>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => navigate(getPathForScreen('settings'))}>
              ⚙️ Notification settings
            </button>
          </>
        }
      />

      {/* Filter pills */}
      <div className="mb-4 flex gap-2">
        {[
          { id: 'all' as const, label: `All (${NOTIFS.length})` },
          { id: 'unread' as const, label: `Unread (${unreadCount})` },
        ].map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)}
            className="rounded-full border px-4 py-1.5 text-[11.5px] font-semibold transition-all"
            style={{
              borderColor: filter === f.id ? 'var(--ai-purple)' : 'var(--border)',
              background: filter === f.id ? 'var(--ai-purple)' : 'var(--card)',
              color: filter === f.id ? '#fff' : 'var(--text-mid)',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {visible.map((n) => {
          const isRead = readMap[n.id]
          const color = TYPE_COLOR[n.type] ?? 'var(--text-mid)'
          return (
            <div key={n.id}
              className="card cursor-pointer transition-all hover:shadow-md"
              style={{
                borderLeft: `4px solid ${isRead ? 'var(--border)' : color}`,
                opacity: isRead ? 0.75 : 1,
                background: isRead ? 'var(--card)' : `${color}06`,
              }}
              onClick={() => {
                markRead(n.id)
                navigate(getPathForScreen(n.link as Parameters<typeof getPathForScreen>[0]))
              }}>
              <div className="flex items-start gap-3 p-[12px_14px]">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full text-[18px]"
                  style={{ background: `${color}15` }}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="font-semibold text-[12px] text-text">{n.actor}</span>
                      {' '}
                      <span className="text-[12px] text-text-mid">{n.action}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] text-text-dim whitespace-nowrap">{n.time}</span>
                      {!isRead && (
                        <div className="size-2 rounded-full" style={{ background: color }} />
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] italic text-text-dim">{n.context}</div>
                </div>
              </div>
            </div>
          )
        })}
        {visible.length === 0 && (
          <div className="card py-12 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-[13px] font-semibold text-text">You're all caught up!</div>
            <div className="text-[11px] text-text-dim mt-1">No unread notifications.</div>
          </div>
        )}
      </div>
    </div>
  )
}
