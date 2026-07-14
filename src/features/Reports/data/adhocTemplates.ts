import type { AdhocReport, ReportTemplate } from '../types'

/** Section C · 4 saved NL-query reports. */
export const ADHOC_REPORTS: AdhocReport[] = [
  {
    id: 'rep-adhoc-1',
    query: 'Domestic meters in Sigra with >50% consumption drop · last 30 days',
    author: 'Rajeev Singh · SE-Bhelupur',
    lastRun: 'Yesterday 14:32',
    uses: 18,
  },
  {
    id: 'rep-adhoc-2',
    query: 'DT-wise loss for Bhelupur division · this month',
    author: 'Pavan Kumar · AEN-Bhelupur',
    lastRun: 'Today 08:14',
    uses: 47,
  },
  {
    id: 'rep-adhoc-3',
    query: 'All meters with magnetic tamper events · last 90 days',
    author: 'Rajiv Mehta · Vigilance',
    lastRun: '04 May',
    uses: 9,
  },
  {
    id: 'rep-adhoc-4',
    query: 'Hit rate by inspector · 14 days',
    author: 'Pavan Kumar · AEN-Bhelupur',
    lastRun: '05 May 09:00',
    uses: 23,
  },
]

/** Section D · 5 report templates. */
export const REPORT_TEMPLATES: ReportTemplate[] = [
  { id: 'rep-tmpl-court', name: 'Section 135 court-ready dossier', uses: 142, lastUsed: 'Today' },
  { id: 'rep-tmpl-board', name: 'Quarterly board pack', uses: 23, lastUsed: '25 Apr' },
  { id: 'rep-tmpl-aen', name: 'AEN weekly performance', uses: 892, lastUsed: 'Today' },
  { id: 'rep-tmpl-dt', name: 'DT-level energy audit', uses: 67, lastUsed: '01 May' },
  { id: 'rep-tmpl-disconnect', name: 'Customer notice · disconnection', uses: 1248, lastUsed: 'Today' },
]
