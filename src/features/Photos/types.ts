export type PhotoFilterId =
  | 'all'
  | 'tamper'
  | 'meter'
  | 'panel'
  | 'premises'
  | 'review'

export interface Photo {
  id: string
  case: string
  consumer: string
  type: string
  date: string
  inspector: string
  aiConf: number
  tags: string[]
  verified: boolean
  gps: string
  flag?: string
}

export interface PhotoCapability {
  icon: string
  name: string
  description: string
}

export interface PhotoFilter {
  filter?: 'rejected'
  status?: 'flagged'
}

export interface PhotoTab {
  id: PhotoFilterId
  label: string
}

export interface PhotoStats {
  qualityRejections: number
  todayUploaded: number
  todayCases: number
  aiAvgConfidence: number
  needsReview: number
  missingPhotos: number
}
