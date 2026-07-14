export interface MobileFeature {
  icon: string
  name: string
  description: string
  color: string
}

export interface FieldActivityEntry {
  who: string
  what: string
  time: string
  dotColor: string
}

export interface MobileWorkflowStep {
  n: string
  title: string
  description: string
}

export interface MobileCaseChip {
  label: string
  variant: 'assigned' | 'confirmed' | 'active' | 'ai'
}

export interface MobileCase {
  id: string
  risk: number
  location: string
  chips?: MobileCaseChip[]
  variant: 'next' | 'queue' | 'synced'
  queueNumber?: number
  photosUploaded?: number
  confirmedLabel?: string
}

export interface MobileStats {
  inspectorsInField: number
  pendingInspections: number
  syncedPhotosToday: number
  syncedSignaturesToday: number
  offlineQueue: number
  appAdoptionPct: number
  activeInspectorCount: number
  totalInspectorCount: number
}
