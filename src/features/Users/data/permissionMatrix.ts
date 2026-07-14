import type { PermissionRow } from '../types'

/** Permission matrix — the prototype's sample for the Inspector role.
 *  Values: true = full access (green ✓), false = no access (red ✗),
 *  string = scope-limited (amber label). */
export const PERMISSION_MATRIX: PermissionRow[] = [
  { screen: 'Overview (Hierarchy)',   view: true,       create: false, edit: false, del: false, export: false },
  { screen: 'Suspicious meters',      view: 'zone',     create: false, edit: false, del: false, export: false },
  { screen: 'Cases',                  view: 'assigned', create: false, edit: true,  del: false, export: false },
  { screen: 'Assessment calculator',  view: true,       create: false, edit: false, del: false, export: false },
  { screen: 'Consumer notices',       view: false,      create: false, edit: false, del: false, export: false },
  { screen: 'Appeals',                view: false,      create: false, edit: false, del: false, export: false },
  { screen: 'Detection rules',        view: false,      create: false, edit: false, del: false, export: false },
  { screen: 'Inspector mobile app',   view: true,       create: true,  edit: true,  del: false, export: false },
  { screen: 'Audit trail',            view: 'own',      create: false, edit: false, del: false, export: false },
]

/** Which role the sample matrix is for (used in the card title). */
export const PERMISSION_MATRIX_ROLE = 'Inspector'
