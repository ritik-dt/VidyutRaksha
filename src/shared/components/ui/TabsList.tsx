import type { HTMLAttributes, KeyboardEvent } from 'react'
import { cn } from './cn'
import { useTabsContext } from './tabsContext'

export type TabsListProps = HTMLAttributes<HTMLDivElement>

export function TabsList({
  className,
  onKeyDown,
  ...props
}: TabsListProps) {
  const { orientation } = useTabsContext()

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) {
      return
    }

    const keyMap =
      orientation === 'vertical'
        ? { next: 'ArrowDown', previous: 'ArrowUp' }
        : { next: 'ArrowRight', previous: 'ArrowLeft' }

    if (event.key !== keyMap.next && event.key !== keyMap.previous) {
      return
    }

    const triggerButtons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[data-ui-tab-trigger="true"]:not([disabled])',
      ),
    )

    if (triggerButtons.length === 0) {
      return
    }

    const activeIndex = triggerButtons.findIndex(
      (button) => button.getAttribute('aria-selected') === 'true',
    )
    const direction = event.key === keyMap.next ? 1 : -1
    const nextIndex =
      activeIndex >= 0
        ? (activeIndex + direction + triggerButtons.length) % triggerButtons.length
        : 0

    const nextButton = triggerButtons[nextIndex]
    nextButton?.focus()
    nextButton?.click()
    event.preventDefault()
  }

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn('mb-4 flex gap-0 border-b-2 border-border', className)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}
