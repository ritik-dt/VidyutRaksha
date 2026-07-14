import type { RoleName } from '../types'

/** Dropdown options, verbatim from the prototype's three <select>s. */
export const ROLE_OPTIONS: RoleName[] = [
  'Admin',
  'Vigilance Officer',
  'Inspector',
  'Executive',
  'Read-only',
]

export const ZONE_OPTIONS = ['Varanasi', 'Bhelupur', 'Residency', 'Gomti Nagar']

export const STATUS_OPTIONS = ['Active', 'Inactive'] as const
