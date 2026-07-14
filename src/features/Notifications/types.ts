export type NotificationType =
  | 'mention'
  | 'assignment'
  | 'update'
  | 'appeal'
  | 'approval'
  | 'alert'
  | 'digest'
  | 'reminder'

export type NotificationFilterId =
  | 'all'
  | 'unread'
  | 'mention'
  | 'assignment'
  | 'update'
  | 'appeal'
  | 'reminder'

export interface Notification {
  id: string
  type: NotificationType
  icon: string
  actor: string
  action: string
  time: string
  read: boolean
  context: string
  link: string
}

export interface NotificationTab {
  id: NotificationFilterId
  label: string
}

export interface NotificationFilter {
  read?: 'false'
  type?: NotificationType
}

export interface NotificationStats {
  unread: number
  mentions: number
  assignments: number
  reminders: number
}
