import type { AlertRule } from '../types'

/** The 8 alert rules. Configuration lives in Settings (not the Alerts page,
 *  which is the daily-monitoring view). Changes apply DISCOM-wide. */
export const ALERT_RULES: AlertRule[] = [
  { name: 'DT overload',       desc: 'DT loading exceeds 85%',                            sev: 'Critical', enabled: true,  channels: 'SMS + Email' },
  { name: 'Cluster detection', desc: '5+ synchronized consumer anomalies under same DTR', sev: 'Critical', enabled: true,  channels: 'SMS + Email' },
  { name: 'Risk escalation',   desc: 'Any meter risk score crosses 75',                   sev: 'Warning',  enabled: true,  channels: 'Email' },
  { name: 'Loss spike',        desc: 'Entity AT&C loss increases >2pp week-over-week',    sev: 'Warning',  enabled: true,  channels: 'Email' },
  { name: 'SAIDI threshold',   desc: 'Feeder SAIDI exceeds 20 hrs/month',                 sev: 'Critical', enabled: true,  channels: 'SMS + Email' },
  { name: 'Comm failure',      desc: '1000+ meters stop reporting simultaneously',        sev: 'Warning',  enabled: true,  channels: 'Email' },
  { name: 'Batch summary',     desc: 'Daily nightly batch completion',                    sev: 'Info',     enabled: true,  channels: 'In-app' },
  { name: 'Model update',      desc: 'ML model retrained',                                sev: 'Info',     enabled: false, channels: 'In-app' },
]

/** Explainer under the Alert rules card title. */
export const ALERT_RULES_BLURB =
  'Detection rules that fire alerts on the Alerts page. Toggle each rule on/off, change severity, or edit the trigger condition. Changes apply DISCOM-wide.'
