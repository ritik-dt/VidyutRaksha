import { useCallback, useEffect, useState } from 'react'
import type { DetailPanelKey } from '../types'

/**
 * Controls which slide-out detail panel is open. Consumed by every clickable
 * KPI/tile/row/link in the dashboard — anywhere an `onOpenPanel(key)` prop is
 * wired, it flows back here.
 */
export function useDetailPanel() {
  const [openKey, setOpenKey] = useState<DetailPanelKey | null>(null)

  const open = useCallback((key: DetailPanelKey) => setOpenKey(key), [])
  const close = useCallback(() => setOpenKey(null), [])

  // Close on Escape
  useEffect(() => {
    if (!openKey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openKey, close])

  return { openKey, open, close }
}
