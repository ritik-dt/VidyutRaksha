import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from 'react'
import { cn } from './cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive, onClick, onKeyDown, role, tabIndex, ...props },
  ref: Ref<HTMLDivElement>,
) {
  const clickable = interactive || Boolean(onClick)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || !clickable || !onClick) {
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event as unknown as ReactMouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative mb-3.5 rounded-xl border border-border bg-card p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color] duration-[180ms]',
        clickable &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-[rgba(124,58,237,0.22)] hover:shadow-[0_10px_24px_rgba(124,58,237,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ai-purple',
        className,
      )}
      role={role ?? (clickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (clickable ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})
