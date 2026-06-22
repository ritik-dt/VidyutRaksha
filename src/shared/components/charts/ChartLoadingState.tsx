import { cn } from '@/shared/components/ui'

export type ChartLoadingSize = 'small' | 'medium' | 'large'

export interface ChartLoadingStateProps {
  size?: ChartLoadingSize
}

const HEIGHTS: Record<ChartLoadingSize, number> = {
  small: 140,
  medium: 220,
  large: 300,
}

const BAR_HEIGHTS = ['42%', '68%', '52%', '78%', '36%', '58%']

export function ChartLoadingState({ size = 'medium' }: ChartLoadingStateProps) {
  const height = HEIGHTS[size]

  return (
    <div className="flex w-full flex-col gap-3.5 p-0.5" style={{ height }}>
      <div className="flex justify-between gap-3">
        <div className="h-4 w-[44%] animate-ui-pulse rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(27,114,232,0.26)]" />
        <div className="h-[22px] w-20 animate-ui-pulse rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(27,114,232,0.26)]" />
      </div>
      <div className="flex flex-1 flex-col justify-end gap-4">
        <div className="grid h-full min-h-[110px] grid-cols-6 items-end gap-2.5 pt-2">
          {BAR_HEIGHTS.map((barHeight, index) => (
            <span
              key={index}
              className={cn(
                'block min-h-6 self-end rounded-t-[10px] rounded-b rounded-b-sm animate-ui-pulse',
                index % 2 === 0
                  ? 'bg-gradient-to-b from-[rgba(124,58,237,0.18)] to-[rgba(27,114,232,0.24)]'
                  : 'bg-gradient-to-b from-[rgba(0,194,203,0.18)] to-[rgba(27,114,232,0.22)]',
              )}
              style={{ height: barHeight }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-full animate-ui-pulse rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(27,114,232,0.26)]" />
          <div className="h-2.5 w-[72%] animate-ui-pulse rounded-full bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(27,114,232,0.26)]" />
        </div>
      </div>
    </div>
  )
}
