import type {
  Notification,
  NotificationFilter,
  NotificationFilterId,
  NotificationStats,
  NotificationTab,
  NotificationType,
} from '../types'

/**
 * Personal notifications — mirrors the prototype's notifs array exactly.
 * API-ready: swap this array (keeping the shape) for a live feed later.
 */
export const NOTIFICATIONS: Notification[] = [
  { id: 'N-842', type: 'mention', icon: '💬', actor: 'Rajiv Mehta', action: 'mentioned you in Case C-20260301-001', time: '5 min ago', read: false, context: '"Good work @RajeshKumar. Proceeding with Section 135 notice..."', link: 'caseDetail' },
  { id: 'N-841', type: 'assignment', icon: '📋', actor: 'System', action: 'assigned 3 new cases to you', time: '22 min ago', read: false, context: 'Cases C-20260417-018, C-20260417-019, C-20260417-020 under Bhelupur feeder', link: 'cases' },
  { id: 'N-840', type: 'update', icon: '📎', actor: 'Rajesh Kumar', action: 'uploaded 6 photos on Case C-20260301-001', time: '1h ago', read: false, context: 'Inspection evidence: tamper seal, earth wire, meter body', link: 'caseDetail' },
  { id: 'N-839', type: 'appeal', icon: '⚖️', actor: 'System', action: 'New appeal filed on your case C-20260301-001', time: '2h ago', read: false, context: 'Consumer HEERA LAL AGRAWAL disputes baseline methodology. Hearing: 22 Apr', link: 'appeals' },
  { id: 'N-838', type: 'approval', icon: '✓', actor: 'Rajiv Mehta', action: 'approved installment plan for C-20260215-025', time: '3h ago', read: true, context: '6-month installment approved. Consumer notification sent.', link: 'caseDetail' },
  { id: 'N-837', type: 'alert', icon: '🔔', actor: 'System', action: 'Critical alert: 12 meters synchronized zero consumption', time: '4h ago', read: true, context: 'Feeder Bhelupur · Possible organized theft cluster', link: 'alerts' },
  { id: 'N-836', type: 'digest', icon: '📊', actor: 'Daily Digest', action: 'Your morning summary is ready', time: 'Today 7:00 AM', read: true, context: 'Overnight: 3 cases updated, 2 appeals progressed, 1 notice delivered', link: '#' },
  { id: 'N-835', type: 'reminder', icon: '⏰', actor: 'System', action: 'Hearing tomorrow: AP-2026-018 (HEERA LAL AGRAWAL)', time: 'Yesterday', read: true, context: '22 Apr at 11:00 AM · Prepare hearing brief', link: 'appeals' },
  { id: 'N-834', type: 'update', icon: '✉️', actor: 'System', action: 'Consumer response received on C-20260301-001', time: 'Yesterday', read: true, context: '"Will pay in installments" — reply logged', link: 'caseDetail' },
  { id: 'N-833', type: 'mention', icon: '💬', actor: 'Sunita Verma', action: 'mentioned you in Case C-20260412-007', time: '2 days ago', read: true, context: '"Need your review on assessment method @RajiviMehta"', link: 'caseDetail' },
]

/** Type-color map (mention→ai-purple, assignment→id-text, etc.) — exact port. */
export function typeColor(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    mention: 'var(--ai-purple)',
    assignment: 'var(--id-text, #0284c7)',
    update: 'var(--teal, #17a2b8)',
    appeal: 'var(--amber)',
    approval: 'var(--green)',
    alert: 'var(--red)',
    digest: 'var(--text-mid)',
    reminder: 'var(--amber)',
  }
  return map[type] ?? 'var(--text-dim)'
}

/** Filter tabs — order and labels match the prototype. */
export const NOTIFICATION_TABS: NotificationTab[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'mention', label: 'Mentions' },
  { id: 'assignment', label: 'Assignments' },
  { id: 'update', label: 'Case updates' },
  { id: 'appeal', label: 'Appeals' },
  { id: 'reminder', label: 'Reminders' },
]

/**
 * KPI values — the prototype hardcodes these in `renderNotifications` (they
 * count things like "3 new cases assigned" that may span multiple notification
 * items), so we mirror those exact numbers. `unread` remains computed so the
 * "Mark all read" action reflects on the KPI immediately.
 */
export function computeNotificationStats(
  notifications: Notification[],
  readOverrides: Record<string, boolean>,
): NotificationStats {
  const isRead = (n: Notification) => readOverrides[n.id] ?? n.read
  return {
    unread: notifications.filter((n) => !isRead(n)).length,
    mentions: 2,
    assignments: 3,
    reminders: 2,
  }
}

/** Count for a specific filter tab — used to render the "Unread (N)" badge. */
export function getTabCount(
  notifications: Notification[],
  tabId: NotificationFilterId,
  readOverrides: Record<string, boolean>,
): number {
  const isRead = (n: Notification) => readOverrides[n.id] ?? n.read
  if (tabId === 'all') return notifications.length
  if (tabId === 'unread') return notifications.filter((n) => !isRead(n)).length
  return notifications.filter((n) => n.type === tabId).length
}

/** Apply the active tab AND active KPI filter (matches the prototype). */
export function filterNotifications(
  notifications: Notification[],
  activeTab: NotificationFilterId,
  filter: NotificationFilter,
  readOverrides: Record<string, boolean>,
): Notification[] {
  const isRead = (n: Notification) => readOverrides[n.id] ?? n.read
  let out = notifications
  if (activeTab === 'unread') out = out.filter((n) => !isRead(n))
  else if (activeTab !== 'all') out = out.filter((n) => n.type === activeTab)
  if (filter.read === 'false') out = out.filter((n) => !isRead(n))
  if (filter.type) out = out.filter((n) => n.type === filter.type)
  return out
}
