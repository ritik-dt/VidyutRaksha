import { cn } from './cn'
import type { ReactNode, ChangeEvent } from 'react'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterBarProps {
  filters: FilterOption[]
  active: string
  onChange: (value: string) => void
  className?: string
  rightSlot?: ReactNode
}

export function FilterBar({ filters, active, onChange, className, rightSlot }: FilterBarProps) {
  return (
    <div className={cn('mb-3.5 flex flex-wrap items-center gap-1.5', className)}>
      <div className="flex flex-1 flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={cn(
              'rounded-lg border px-3 py-[5px] text-[11px] font-semibold transition-all duration-150',
              active === f.value
                ? 'border-ai-purple bg-ai-purple text-white'
                : 'border-border bg-card text-text-mid hover:border-ai-purple hover:text-ai-purple',
            )}
          >
            {f.label}
            {f.count != null && (
              <span className={cn('ml-1.5 rounded-full px-1.5 py-px text-[10px]', active === f.value ? 'bg-white/20' : 'bg-bg text-text-dim')}>
                {f.count.toLocaleString('en-IN')}
              </span>
            )}
          </button>
        ))}
      </div>
      {rightSlot && <div className="flex items-center gap-1.5">{rightSlot}</div>}
    </div>
  )
}

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-text-dim">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[30px] w-full rounded-lg border border-border bg-card pl-7 pr-3 text-[11px] text-text outline-none transition-colors focus:border-ai-purple focus:ring-1 focus:ring-ai-purple/20"
      />
    </div>
  )
}
