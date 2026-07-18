import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ToastItem, ToastOptions, ToastType } from '@/shared/types'
import { ToastContext, type ToastContextValue } from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

/**
 * Owns the toast queue. `showToast` accepts either a message string (defaults
 * to info tone) or a full `ToastOptions` object; dismissal is either explicit
 * (via `dismissToast(id)`) or automatic after the toast's `duration` (default
 * 4 seconds).
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)

  const dismissToast = useCallback((id: string) => {
    setToasts((current: ToastItem[]) => current.filter((toast: ToastItem) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const normalized: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'info' } : options

      const id = `toast-${++toastIdRef.current}`
      const type: ToastType = normalized.type ?? 'info'
      const duration = normalized.duration ?? 4000

      setToasts((current: ToastItem[]) => [
        ...current,
        {
          ...normalized,
          id,
          type,
        },
      ])

      window.setTimeout(() => {
        dismissToast(id)
      }, duration)
    },
    [dismissToast],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [toasts, showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}
