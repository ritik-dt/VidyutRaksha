import type { Channel, FreqOption } from '../types'

/** The 3 delivery channels. */
export const CHANNELS: Channel[] = [
  { id: 'inApp', label: 'In-app', icon: '🔔' },
  { id: 'email', label: 'Email',  icon: '✉️' },
  { id: 'sms',   label: 'SMS',    icon: '📱' },
]

/** Delivery frequency options (order matters — matches the prototype's select). */
export const FREQ_OPTIONS: FreqOption[] = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'digest',   label: 'Daily digest' },
  { value: 'off',      label: 'Off' },
]
