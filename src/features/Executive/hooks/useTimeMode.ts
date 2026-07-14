import { useCallback, useState } from 'react'
import type { TimeMode } from '../types'

/** Real-time vs Month-wise toggle for the time-mode bar. */
export function useTimeMode() {
  const [state, setState] = useState<TimeMode>({ mode: 'realtime' })
  const setRealtime = useCallback(() => setState({ mode: 'realtime' }), [])
  const setMonthly = useCallback(
    (month = "Nov'25") => setState({ mode: 'monthly', activeMonth: month }),
    [],
  )
  return { ...state, setRealtime, setMonthly }
}
