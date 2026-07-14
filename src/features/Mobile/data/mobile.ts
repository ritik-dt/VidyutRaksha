import type {
  FieldActivityEntry,
  MobileCase,
  MobileFeature,
  MobileStats,
  MobileWorkflowStep,
} from '../types'

/** KPI values — matches the prototype + screenshots (hardcoded, API-replaceable). */
export const MOBILE_STATS: MobileStats = {
  inspectorsInField: 6,
  pendingInspections: 18,
  syncedPhotosToday: 42,
  syncedSignaturesToday: 8,
  offlineQueue: 3,
  appAdoptionPct: 98,
  activeInspectorCount: 47,
  totalInspectorCount: 48,
}

/** 8 mobile app features — mirrors the prototype's array exactly. */
export const MOBILE_FEATURES: MobileFeature[] = [
  { icon: '📷', name: 'Photo capture + geo-tag', description: 'Auto-stamp GPS coordinates and timestamp on every photo. Up to 10 photos per inspection.', color: 'var(--teal, #17a2b8)' },
  { icon: '✍️', name: 'Digital signature capture', description: 'Consumer + inspector signature on-screen. Cryptographically bound to inspection report.', color: 'var(--ai-purple)' },
  { icon: '📡', name: 'Full offline mode', description: 'Cases, checklists, and evidence are downloaded before field visit. Work without connectivity for hours, sync when back online.', color: 'var(--green)' },
  { icon: '📍', name: 'Live GPS tracking', description: 'Admin dashboard shows inspector locations in real-time. Optimizes routing and proves field presence.', color: 'var(--red)' },
  { icon: '🎤', name: 'Voice notes', description: 'Quick observation recording when typing is impractical. Auto-transcribed via LLM (EN + Hindi).', color: 'var(--id-text, #0284c7)' },
  { icon: '📱', name: 'QR + barcode scan', description: 'Scan meter serial number to instantly load case context. No manual entry.', color: 'var(--amber)' },
  { icon: '✅', name: 'Step-by-step checklist', description: 'Theft-type-specific inspection checklist enforced by app. Cannot submit without completing mandatory steps.', color: 'var(--green)' },
  { icon: '📄', name: 'PDF evidence pack', description: 'Generate and send complete evidence pack directly from phone. Shareable via WhatsApp/Email.', color: 'var(--ai-purple)' },
]

/** Live field activity feed — 5 entries matching the prototype. */
export const FIELD_ACTIVITY: FieldActivityEntry[] = [
  { who: 'Rajesh Kumar', what: 'Inspecting #1849966 at Bhelupur', time: 'Now', dotColor: 'var(--green)' },
  { who: 'Amit Singh', what: 'Photo captured (6) at Residency', time: '4 min ago', dotColor: 'var(--teal, #17a2b8)' },
  { who: 'Sunita Verma', what: 'Signature received from consumer', time: '18 min ago', dotColor: 'var(--ai-purple)' },
  { who: 'Vikram Yadav', what: 'Offline — syncing when available', time: '32 min ago', dotColor: 'var(--amber)' },
  { who: 'Priya Mishra', what: 'Case C-20260417-018 completed', time: '1h ago', dotColor: 'var(--green)' },
]

/** 3 cases shown inside the phone mock. */
export const MOBILE_MOCK_CASES: MobileCase[] = [
  {
    id: '#1849966',
    risk: 94,
    location: '📍 Bhelupur • 2.4 km',
    chips: [
      { label: 'Earth loading', variant: 'confirmed' },
      { label: '-54%', variant: 'confirmed' },
      { label: '50 events', variant: 'active' },
    ],
    variant: 'next',
  },
  {
    id: '#1705463',
    risk: 88,
    location: '📍 Bhelupur • HEERA LAL',
    variant: 'queue',
    queueNumber: 2,
  },
  {
    id: '#2034871',
    risk: 0,
    location: '',
    variant: 'synced',
    photosUploaded: 8,
    confirmedLabel: 'Meter Bypass confirmed',
  },
]

/** 8-step inspection workflow — matches the prototype's card. */
export const WORKFLOW_STEPS: MobileWorkflowStep[] = [
  { n: '1', title: 'Accept case', description: 'From assigned queue' },
  { n: '2', title: 'Navigate', description: 'GPS route to meter' },
  { n: '3', title: 'Scan QR', description: 'Auto-load context' },
  { n: '4', title: 'Checklist', description: 'Theft-type specific' },
  { n: '5', title: 'Photos', description: 'Min 3, max 10, geo-tagged' },
  { n: '6', title: 'Notes', description: 'Voice or text' },
  { n: '7', title: 'Signatures', description: 'Consumer + inspector' },
  { n: '8', title: 'Sync', description: 'Evidence to server' },
]
