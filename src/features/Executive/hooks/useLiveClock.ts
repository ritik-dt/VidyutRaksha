import { useEffect, useState } from 'react'

/** Ticking Date object updated once per second. Used by the time-mode bar
 *  so the "Live · HH:MM:SS" chip stays fresh. */
export function useLiveClock(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
