export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'ai'

export interface ToastOptions {
  title?: string
  message: string
  type?: ToastType
  duration?: number
  icon?: string
}

export interface ToastItem extends ToastOptions {
  id: string
  type: ToastType
}
