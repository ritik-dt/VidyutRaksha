export interface Cluster {
  id: string
  name: string
  dtr: string
  feeder: string
  members: number
  confirmed: number
  pending: number
  amount: string
  amountNum: number
  pattern: string
  started: string
  risk: number
  status: string
  lead: string
}

export type ClusterMemberStatus = 'Confirmed' | 'Under inspection' | 'Pending'

export interface ClusterMember {
  name: string
  meter: string
  detail: string
  status: ClusterMemberStatus
}

export interface ClusterReason {
  icon: string
  title: string
  body: string
}

export interface ClusterFilter {
  status?: 'active' | 'pending'
}

export interface ClusterStats {
  totalGroups: number
  totalConsumers: number
  totalConfirmed: number
  totalPending: number
  totalExposureNum: number
  totalExposureStr: string
  largestGroup: number
  largestGroupName: string
}

export interface ClusterChartDatum {
  labels: string[]
  values: number[]
}
