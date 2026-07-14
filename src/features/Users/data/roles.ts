import type { Role } from '../types'

/** Role definitions & permissions — the 5 cards in the prototype's grid. */
export const ROLES: Role[] = [
  {
    name: 'Admin',
    color: 'var(--ai-purple)',
    count: 2,
    perms: [
      'Full access',
      'Manage users',
      'Configure rules',
      'Modify assessments',
      'Approve installments',
      'Generate reports',
      'View all data',
    ],
  },
  {
    name: 'Vigilance Officer',
    color: 'var(--id-text)',
    count: 4,
    perms: [
      'View all cases',
      'Assign inspectors',
      'Review assessments',
      'Generate notices',
      'Handle appeals',
      'Zone-limited data',
    ],
  },
  {
    name: 'Inspector',
    color: 'var(--green)',
    count: 6,
    perms: [
      'View assigned cases',
      'Submit inspection reports',
      'Upload evidence',
      'Update case status',
      'Mobile app access',
      'No rule editing',
    ],
  },
  {
    name: 'Executive',
    color: 'var(--amber)',
    count: 2,
    perms: [
      'Read-only dashboards',
      'Executive reports',
      'Cross-DISCOM view',
      'Export capabilities',
      'No case modification',
    ],
  },
  {
    name: 'Read-only',
    color: 'var(--text-dim)',
    count: 3,
    perms: [
      'View only access',
      'No modifications',
      'Zone-limited',
      'No exports',
      'For audit & compliance',
    ],
  },
]
