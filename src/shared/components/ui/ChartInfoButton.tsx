import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { getChartInfo } from '@/shared/config/chartInfo'
import { cn } from './cn'

const POPOVER_WIDTH = 320
const GAP = 8
const EDGE = 10

export interface ChartInfoButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'id'> {
  /** Key into the CHART_INFO catalog. */
  chartId: string
}

interface PopoverPosition {
  left: number
  top: number
}

/**
 * Inline "ⓘ" button that opens a fixed, viewport-aware popover explaining a
 * chart (title / body / How to read / Data source). Mirrors the prototype's
 * `infoBtn` + `showChartInfo` behavior and is reused across every chart.
 */
export function ChartInfoButton({
  chartId,
  className,
  onClick,
  ...props
}: ChartInfoButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const info = getChartInfo(chartId)

  const reposition = useCallback(() => {
    const button = buttonRef.current
    const popover = popoverRef.current
    if (!button || !popover) return

    const rect = button.getBoundingClientRect()
    const popH = popover.offsetHeight

    let left = rect.left + rect.width / 2 - POPOVER_WIDTH / 2
    let top = rect.bottom + GAP

    if (left < EDGE) left = EDGE
    if (left + POPOVER_WIDTH > window.innerWidth - EDGE) {
      left = window.innerWidth - POPOVER_WIDTH - EDGE
    }
    if (top + popH > window.innerHeight - EDGE) {
      top = rect.top - popH - GAP
    }

    setPosition({ left, top })
  }, [])

  // Measure + position once the popover is in the DOM.
  useLayoutEffect(() => {
    if (open) reposition()
  }, [open, reposition])

  // Close on Escape; reposition on scroll/resize while open.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, reposition])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        title="What is this?"
        aria-label={`About: ${info.title}`}
        aria-expanded={open}
        className={cn(
          'ml-1.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-border align-middle font-serif text-[10px] font-bold text-text-mid italic transition-all hover:scale-115 hover:bg-ai-purple hover:text-white',
          className,
        )}
        onClick={(event) => {
          event.stopPropagation()
          onClick?.(event)
          setOpen((current) => !current)
        }}
        {...props}
      >
        i
      </button>

      {open &&
        createPortal(
          <>
            {/* Backdrop — click anywhere to dismiss */}
            <div
              className="fixed inset-0 z-[9997]"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={popoverRef}
              role="dialog"
              className="fixed z-[9998] max-w-[320px] min-w-[260px] animate-pop-in rounded-[10px] border border-border bg-card p-[14px_16px] shadow-[0_12px_40px_rgba(10,25,50,0.18),0_2px_6px_rgba(10,25,50,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.3)]"
              style={{
                left: position?.left ?? -9999,
                top: position?.top ?? -9999,
                visibility: position ? 'visible' : 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute top-1.5 right-2 cursor-pointer border-none bg-transparent px-1.5 py-0.5 text-base leading-none text-text-dim hover:text-text"
                onClick={() => setOpen(false)}
              >
                ×
              </button>

              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-text">
                <span className="text-[14px] text-ai-purple">ⓘ</span>
                {info.title}
              </div>

              <div className="text-[11.5px] leading-[1.55] text-text-mid">
                {info.body}
              </div>

              {info.how ? (
                <div className="mt-2 border-t border-dashed border-border pt-2 text-[11.5px] leading-[1.55] text-text-mid">
                  <strong className="mb-[3px] block text-[10px] tracking-[0.6px] text-ai-purple uppercase">
                    How to read
                  </strong>
                  {info.how}
                </div>
              ) : null}

              {info.source ? (
                <div className="mt-2 border-t border-dashed border-border pt-2 text-[11.5px] leading-[1.55] text-text-mid">
                  <strong className="mb-[3px] block text-[10px] tracking-[0.6px] text-ai-purple uppercase">
                    Data source
                  </strong>
                  {info.source}
                </div>
              ) : null}
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
