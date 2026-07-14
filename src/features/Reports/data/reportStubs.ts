import type { ReportId, ReportStub } from '../types'

/** 10 lightweight report previews (1 internal + 4 ad-hoc + 5 templates).
 *  Verbatim from the prototype's _REPORT_STUB_INFO. */
export const REPORT_STUBS: Partial<Record<ReportId, ReportStub>> = {
  'rep-cluster-digest': {
    title: 'Cluster-Detection Digest · Wk-19',
    subtitle: 'AI-identified organised theft patterns · interactive',
    sectionTitles: [
      'New clusters this week',
      'Pattern types (load drop, simultaneous tamper)',
      'Geo-spatial concentration',
      'Recommended inspection routes',
      'Outcome of prior-week clusters',
    ],
  },
  'rep-adhoc-1': {
    title: 'Ad-hoc Query · Domestic meters · Sigra · drop > 50%',
    subtitle: 'NL-query saved by Rajeev Singh (SE) · ran 18 times',
    sectionTitles: [
      'Query expansion',
      'Filter criteria',
      'Result · 247 meters',
      'Risk score distribution',
      'Recommended actions',
    ],
  },
  'rep-adhoc-2': {
    title: 'Ad-hoc Query · DT-wise loss · Bhelupur',
    subtitle: 'NL-query saved by Pavan Kumar (AEN) · ran 47 times',
    sectionTitles: [
      'DT list · 12 DTs',
      'Loss decomposition (technical / commercial)',
      'Phase imbalance flags',
      'Inspection priority',
      'Comparison to last month',
    ],
  },
  'rep-adhoc-3': {
    title: 'Ad-hoc Query · Magnetic tamper · 90 days',
    subtitle: 'NL-query saved by Rajiv Mehta (Vigilance) · ran 9 times',
    sectionTitles: [
      'Tamper events by date',
      'Geographic distribution',
      'Repeat-offender consumers',
      'Action taken summary',
      'Pending field verification',
    ],
  },
  'rep-adhoc-4': {
    title: 'Ad-hoc Query · Inspector hit rate · 14 days',
    subtitle: 'NL-query saved by Pavan Kumar (AEN) · ran 23 times',
    sectionTitles: [
      'Inspector roster',
      'Hit rate by inspector',
      'Inspections vs confirmed cases',
      'Comparison vs network avg',
      'Performance trend',
    ],
  },
  'rep-tmpl-court': {
    title: 'Template · Section 135 Court-Ready Dossier',
    subtitle: 'Used 142 times · most recent: today',
    sectionTitles: [
      'Statutory cover page',
      'Inspection Form-A',
      '3 months meter data',
      'Phasor anomaly snapshots',
      'Tamper event log',
      'Assessment calculation',
      'Photographic evidence',
      'Witness depositions',
    ],
  },
  'rep-tmpl-board': {
    title: 'Template · Quarterly Board Pack',
    subtitle: 'Used 23 times · most recent: 25 Apr',
    sectionTitles: [
      '10-slide structure',
      'Auto-fill data sources',
      'UPPCL brand template',
      'Hindi summary appendix',
      'Speaker notes',
    ],
  },
  'rep-tmpl-aen': {
    title: 'Template · AEN Weekly Performance',
    subtitle: 'Used 892 times · most recent: today',
    sectionTitles: [
      'Inspector roster',
      'KPI calculation',
      'Comparative benchmarks',
      'Action items',
      'Auto-distribution list',
    ],
  },
  'rep-tmpl-dt': {
    title: 'Template · DT-level Energy Audit',
    subtitle: 'Used 67 times · most recent: 01 May',
    sectionTitles: [
      'DT input vs billed',
      'Technical / commercial split',
      'Phase imbalance',
      'Top loss DTs',
      'Recommendation matrix',
    ],
  },
  'rep-tmpl-disconnect': {
    title: 'Template · Customer Disconnection Notice',
    subtitle: 'Used 1,248 times · most recent: today',
    sectionTitles: [
      'Cover with consumer details',
      'EA 2003 §56 cite',
      'Outstanding amount',
      'Grace period',
      'Reconnection terms',
      'Hindi-English bilingual',
    ],
  },
}
