import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'
import { sanitizeTabValue, useTabsContext } from './Tabs'

export interface TabsTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  value: string
  children?: ReactNode
}

export function TabsTrigger({
  value,
  className,
  disabled = false,
  children,
  id,
  ...props
}: TabsTriggerProps) {
  const { activeValue, setActiveValue, idPrefix } = useTabsContext()
  const selected = activeValue === value
  const triggerId = id ?? `${idPrefix}-trigger-${sanitizeTabValue(value)}`
  const contentId = `${idPrefix}-content-${sanitizeTabValue(value)}`

  return (
    <button
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={contentId}
      data-ui-tab-trigger="true"
      data-state={selected ? 'active' : 'inactive'}
      className={cn(
        '-mb-0.5 cursor-pointer border-b-[3px] border-transparent bg-transparent px-[18px] py-[9px] font-sans text-xs text-text-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ai-purple disabled:cursor-not-allowed disabled:opacity-40',
        selected && 'border-b-ai-purple font-bold text-ai-purple',
        className,
      )}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onClick={() => {
        if (!disabled) {
          setActiveValue(value)
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}
