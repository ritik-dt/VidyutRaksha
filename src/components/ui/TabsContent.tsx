import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'
import { sanitizeTabValue, useTabsContext } from './Tabs'

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children?: ReactNode
}

export function TabsContent({
  value,
  className,
  children,
  id,
  ...props
}: TabsContentProps) {
  const { activeValue, idPrefix } = useTabsContext()
  const selected = activeValue === value
  const contentId = id ?? `${idPrefix}-content-${sanitizeTabValue(value)}`
  const triggerId = `${idPrefix}-trigger-${sanitizeTabValue(value)}`

  if (!selected) {
    return (
      <div
        id={contentId}
        role="tabpanel"
        aria-labelledby={triggerId}
        hidden
        className={cn('hidden', className)}
        {...props}
      />
    )
  }

  return (
    <div
      id={contentId}
      role="tabpanel"
      aria-labelledby={triggerId}
      className={cn('block', className)}
      {...props}
    >
      {children}
    </div>
  )
}
