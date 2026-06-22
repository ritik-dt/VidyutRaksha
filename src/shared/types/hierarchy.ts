export type HierNodeType =
  | 'State'
  | 'DISCOM'
  | 'Zone'
  | 'Circle'
  | 'Division'
  | 'Sub-division'
  | 'Feeder'
  | 'DTR'
  | 'Consumer'

export interface HierChildRef {
  id: string
  name: string
  meters?: number
  flagged?: number
  critical?: number
  high?: number
  medium?: number
  inspected?: number
  confirmed?: number
  recovered?: number
  assessed?: number
  realized?: number
  hitRate?: number
  loss?: number
  meter?: string
  cat?: string
  tariff?: string
  load?: string
  risk?: number
  drop?: number
  events?: number
}

export interface HierNode {
  name: string
  type: HierNodeType | string
  parent?: string | null
  meters?: number
  flagged?: number
  critical?: number
  high?: number
  medium?: number
  inspected?: number
  confirmed?: number
  recovered?: number
  assessed?: number
  realized?: number
  hitRate?: number
  loss?: number
  children?: HierChildRef[]
  _synthetic?: boolean
}

export type HierPath = string[]

export type HierDataMap = Record<string, HierNode>
