import type { ChartOptions as ChartJsOptions, ChartType } from 'chart.js'
import type { ChartLegendItem } from '@/shared/types'

export interface ChartPalette {
  bg: string
  card: string
  cardHover: string
  text: string
  textMid: string
  textDim: string
  border: string
  borderSoft: string
  purple: string
  purpleSoft: string
  blue: string
  cyan: string
  green: string
  amber: string
  red: string
  grid: string
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function mergeDeep<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base
  }

  const output = Array.isArray(base) ? [...base] : { ...base }
  for (const [key, overrideValue] of Object.entries(overrides)) {
    const baseValue = (base as Record<string, unknown>)[key]
    if (isRecord(baseValue) && isRecord(overrideValue)) {
      ;(output as Record<string, unknown>)[key] = mergeDeep(
        baseValue,
        overrideValue as DeepPartial<Record<string, unknown>>,
      )
    } else if (overrideValue !== undefined) {
      ;(output as Record<string, unknown>)[key] = overrideValue
    }
  }

  return output as T
}

export function getChartPalette(isDark: boolean): ChartPalette {
  return isDark
    ? {
        bg: '#060e1c',
        card: '#0e1a2e',
        cardHover: '#111d32',
        text: '#e2ebf8',
        textMid: '#8da0c0',
        textDim: '#5a6e8c',
        border: '#1e2f4a',
        borderSoft: '#142038',
        purple: '#a78bfa',
        purpleSoft: 'rgba(109, 40, 217, 0.15)',
        blue: '#5a9df5',
        cyan: '#22d3db',
        green: '#22c55e',
        amber: '#f59e0b',
        red: '#ff6b6b',
        grid: 'rgba(141, 160, 192, 0.18)',
      }
    : {
        bg: '#f0f4fa',
        card: '#ffffff',
        cardHover: '#fafcff',
        text: '#0a1628',
        textMid: '#3b4f6e',
        textDim: '#6b7a99',
        border: '#dde5f0',
        borderSoft: '#eef2f8',
        purple: '#7c3aed',
        purpleSoft: 'rgba(124, 58, 237, 0.12)',
        blue: '#1b72e8',
        cyan: '#00c2cb',
        green: '#22c55e',
        amber: '#f59e0b',
        red: '#ef4444',
        grid: 'rgba(107, 122, 153, 0.18)',
      }
}

export function createChartDefaults<TType extends ChartType>(
  isDark: boolean,
): ChartJsOptions<TType> {
  const palette = getChartPalette(isDark)
  const defaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 420,
      easing: 'easeOutQuart' as const,
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: palette.textMid,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: palette.card,
        titleColor: palette.text,
        bodyColor: palette.textMid,
        borderColor: palette.border,
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: palette.textDim,
          font: { size: 11 },
        },
        grid: {
          color: palette.grid,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: palette.textDim,
          font: { size: 11 },
        },
        grid: {
          color: palette.grid,
        },
        border: {
          display: false,
        },
      },
    },
  } satisfies ChartJsOptions<'line'>

  return defaults as ChartJsOptions<TType>
}

export function createArcDefaults<TType extends 'pie' | 'doughnut'>(
  isDark: boolean,
): ChartJsOptions<TType> {
  const palette = getChartPalette(isDark)
  const defaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 420,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: palette.textMid,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 16,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        backgroundColor: palette.card,
        titleColor: palette.text,
        bodyColor: palette.textMid,
        borderColor: palette.border,
        borderWidth: 1,
        padding: 12,
      },
    },
  } satisfies ChartJsOptions<'pie'>

  return defaults as ChartJsOptions<TType>
}

export function createLegendItems(
  labels: string[],
  colors: string[],
  values?: Array<string | number>,
): ChartLegendItem[] {
  return labels.map((label, index) => ({
    label,
    color: colors[index] ?? colors[0] ?? '#1b72e8',
    value: values?.[index],
  }))
}

export function applyChartConfig<TType extends ChartType>(
  base: ChartJsOptions<TType>,
  overrides?: DeepPartial<ChartJsOptions<TType>>,
): ChartJsOptions<TType> {
  return mergeDeep(base, overrides)
}
