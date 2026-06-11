import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ToastItem, ToastOptions, ToastType } from '@/types'

interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (options: ToastOptions | string) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastIdRef = useRef(0)

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (options: ToastOptions | string) => {
      const normalized: ToastOptions =
        typeof options === 'string' ? { message: options, type: 'info' } : options

      const id = `toast-${++toastIdRef.current}`
      const type: ToastType = normalized.type ?? 'info'
      const duration = normalized.duration ?? 4000

      setToasts((current) => [
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

  const value = useMemo(
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

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
