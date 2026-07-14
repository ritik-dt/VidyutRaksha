import type { NotifPrefsMap } from '@/shared/types/notif'

/**
 * Default per-role notification preferences — verbatim from the prototype's
 * DEFAULT_NOTIF_PREFS. Every role gets its own baseline (CMD leans on email
 * digests, AEN is SMS/field-first, Analyst is digest-only), which the user can
 * override in Settings and restore at any time.
 */
export const DEFAULT_NOTIF_PREFS: NotifPrefsMap = {
  cmd: {
    'high-risk': { inApp: false, email: true, sms: false, freq: 'digest' },
    'sla-breach': { inApp: false, email: true, sms: false, freq: 'digest' },
    'overload': { inApp: false, email: true, sms: false, freq: 'digest' },
    'approval': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'kpi-alert': { inApp: true, email: true, sms: false, freq: 'realtime' },
  },
  chief: {
    'high-risk': { inApp: true, email: true, sms: false, freq: 'digest' },
    'sla-breach': { inApp: true, email: true, sms: false, freq: 'digest' },
    'overload': { inApp: true, email: true, sms: false, freq: 'realtime' },
    'approval': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'kpi-alert': { inApp: true, email: true, sms: false, freq: 'realtime' },
  },
  se: {
    'high-risk': { inApp: true, email: true, sms: false, freq: 'realtime' },
    'sla-breach': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'overload': { inApp: true, email: true, sms: false, freq: 'realtime' },
    'approval': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'kpi-alert': { inApp: true, email: true, sms: false, freq: 'realtime' },
  },
  ee: {
    'high-risk': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'sla-breach': { inApp: true, email: true, sms: true, freq: 'realtime' },
    'overload': { inApp: true, email: true, sms: false, freq: 'realtime' },
    'approval': { inApp: true, email: false, sms: false, freq: 'realtime' },
    'kpi-alert': { inApp: true, email: false, sms: false, freq: 'digest' },
  },
  aen: {
    'high-risk': { inApp: true, email: false, sms: true, freq: 'realtime' },
    'sla-breach': { inApp: true, email: false, sms: true, freq: 'realtime' },
    'overload': { inApp: true, email: false, sms: true, freq: 'realtime' },
    'approval': { inApp: false, email: false, sms: false, freq: 'off' },
    'kpi-alert': { inApp: true, email: false, sms: false, freq: 'digest' },
  },
  analyst: {
    'high-risk': { inApp: true, email: false, sms: false, freq: 'digest' },
    'sla-breach': { inApp: false, email: false, sms: false, freq: 'off' },
    'overload': { inApp: true, email: false, sms: false, freq: 'digest' },
    'approval': { inApp: false, email: false, sms: false, freq: 'off' },
    'kpi-alert': { inApp: true, email: false, sms: false, freq: 'digest' },
  },
}
