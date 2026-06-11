import type {
  ChartData as ChartJsData,
  ChartDataset as ChartJsDataset,
  ChartOptions as ChartJsOptions,
  ChartType,
  DefaultDataPoint,
} from 'chart.js'
import type { ReactNode } from 'react'

export interface ChartPoint {
  x: string | number | Date
  y: number
  label?: string
}

export interface ChartSeries<TPoint extends ChartPoint = ChartPoint> {
  label: string
  data: TPoint[]
  color?: string
}

export type ChartDataset<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
> = ChartJsDataset<TType, TData>

export type ChartData<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown,
> = ChartJsData<TType, TData, TLabel>

export type ChartOptions<TType extends ChartType = ChartType> = ChartJsOptions<TType>

export interface TrendData {
  label: string
  value: number
}

export interface ChartLegendItem {
  label: ReactNode
  color: string
  value?: ReactNode
  hidden?: boolean
  shape?: 'line' | 'dot' | 'square'
}
