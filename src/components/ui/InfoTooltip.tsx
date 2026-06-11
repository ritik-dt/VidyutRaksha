import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type ReactNode,
} from 'react'
import { cn } from './cn'
import { InfoIcon, XIcon } from './icons'

export interface InfoTooltipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'content'> {
  content: ReactNode
  icon?: ReactNode
  label?: string
}

export function InfoTooltip({
  content,
  icon,
  label = 'More information',
  className,
  onClick,
  onKeyDown,
  ...props
}: InfoTooltipProps) {
  const tooltipId = useId()
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event: FocusEvent<HTMLSpanElement>) => {
        const nextTarget = event.relatedTarget as Node | null
        if (!event.currentTarget.contains(nextTarget)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className={cn(
          'inline-flex size-4 cursor-pointer items-center justify-center rounded-full border-none bg-border font-serif text-[10px] font-bold text-text-mid italic transition-all hover:scale-115 hover:bg-ai-purple hover:text-white',
          className,
        )}
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onClick={(event) => {
          onClick?.(event)
          setOpen((current) => !current)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.key === 'Escape') {
            setOpen(false)
          }
        }}
        {...props}
      >
        {icon ?? <InfoIcon className="size-3" />}
      </button>
      {open ? (
        <span
          className="absolute top-[calc(100%+10px)] right-0 z-20 min-w-60 max-w-80 animate-pop-in rounded-[10px] border border-border bg-card p-3 px-3.5 pl-4 shadow-[0_14px_40px_rgba(10,25,50,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.3)]"
          role="tooltip"
          id={tooltipId}
        >
          <button
            type="button"
            className="absolute top-1.5 right-1.5 flex size-[22px] cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-dim hover:bg-bg hover:text-text"
            aria-label="Close tooltip"
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-3" />
          </button>
          <span className="block pr-5 text-[11.5px] leading-snug text-text-mid">
            {content}
          </span>
        </span>
      ) : null}
    </span>
  )
}
