import type { ReactNode } from 'react'
import type { ChartLegendItem } from '@/types'
import { cn } from '@/components/ui'

export interface ChartLegendProps {
  items: ChartLegendItem[]
  className?: string
  onItemClick?: (item: ChartLegendItem) => void
}

export function ChartLegend({ items, className, onItemClick }: ChartLegendProps) {
  return (
    <ul
      className={cn('m-0 flex flex-wrap gap-x-3 gap-y-2 p-0', className)}
      aria-label="Chart legend"
    >
      {items.map((item, index) => {
        const clickable = Boolean(onItemClick)
        const Content = ({ children }: { children: ReactNode }) =>
          clickable ? (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-bg px-2 py-1 text-[10.5px] text-text-mid hover:border-ai-purple hover:bg-ai-purple-light hover:text-ai-purple"
              onClick={() => onItemClick?.(item)}
            >
              {children}
            </button>
          ) : (
            <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border bg-bg px-2 py-1 text-[10.5px] text-text-mid">
              {children}
            </span>
          )

        return (
          <li
            key={`${index}-${String(item.label)}`}
            className={cn('inline-flex', item.hidden && 'opacity-55')}
          >
            <Content>
              <span
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  item.shape === 'line' && 'h-[3px] w-2.5 rounded-full',
                  item.shape === 'square' && 'rounded-sm',
                )}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
              {item.value !== undefined ? (
                <span className="font-mono text-text">{item.value}</span>
              ) : null}
            </Content>
          </li>
        )
      })}
    </ul>
  )
}
