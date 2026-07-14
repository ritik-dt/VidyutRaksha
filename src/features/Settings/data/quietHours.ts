import type { QuietHours } from '../types'

/** Default quiet-hours window. */
export const DEFAULT_QUIET_HOURS: QuietHours = { from: '22:00', to: '07:00' }

export const QUIET_HOURS_BLURB =
  'No notifications during these hours, except critical alerts (DT failure, fire, security).'

export const QUIET_HOURS_NOTE_HTML =
  '<strong>Note:</strong> Critical security alerts (cluster theft detected, DT fire alarm) override quiet hours.'

/** The push-device row is static in the prototype. */
export const PUSH_DEVICE = 'Samsung Galaxy A54 · last active 12 min ago'
