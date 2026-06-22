import { cn } from '@/shared/components/ui/cn'
import { useToast } from '@/shared/context/ToastContext'
import type { ToastType } from '@/shared/types'

const TOAST_COLORS: Record<ToastType, string> = {
  info: 'var(--id-text)',
  success: 'var(--green)',
  warning: 'var(--amber)',
  error: 'var(--red)',
  ai: 'var(--ai-purple)',
}

const TOAST_ICONS: Record<ToastType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×',
  ai: '✦',
}

const TOAST_BORDER: Record<ToastType, string> = {
  info: 'border-l-id-text',
  success: 'border-l-green',
  warning: 'border-l-amber',
  error: 'border-l-red',
  ai: 'border-l-ai-purple bg-gradient-to-r from-card to-ai-purple-light',
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div
      className="pointer-events-none fixed top-6 right-6 z-[99999] flex max-w-[380px] flex-col gap-2.5"
      id="toastContainer"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.id}
          className={cn(
            'pointer-events-auto flex min-w-[280px] animate-toast-in items-start gap-2.5 rounded-[10px] border-l-4 bg-card p-3 px-4 shadow-[0_10px_40px_rgba(10,25,50,0.18),0_2px_8px_rgba(10,25,50,0.08)]',
            TOAST_BORDER[toast.type],
            'dark:shadow-[0_10px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]',
          )}
        >
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: TOAST_COLORS[toast.type] }}
          >
            {toast.icon ?? TOAST_ICONS[toast.type]}
          </div>
          <div className="min-w-0 flex-1">
            {toast.title ? (
              <div className="mb-0.5 text-[12.5px] leading-snug font-bold text-text">
                {toast.title}
              </div>
            ) : null}
            <div className="text-[11.5px] leading-snug text-text-mid">
              {toast.message}
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer border-none bg-transparent p-0.5 px-1.5 text-sm leading-none text-text-dim transition-colors hover:text-text"
            onClick={() => dismissToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
