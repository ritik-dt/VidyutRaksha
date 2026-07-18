import { createContext, useContext } from 'react'
import type { ToastItem, ToastOptions } from '@/shared/types'

export interface ToastContextValue {
  toasts: ToastItem[]
  showToast: (options: ToastOptions | string) => void
  dismissToast: (id: string) => void
}

/**
 * Toast context — split from `ToastProvider.tsx` so this module exports only
 * non-components (context object, hook, types). See the ThemeContext comment
 * for the Fast Refresh rationale.
 */
export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
