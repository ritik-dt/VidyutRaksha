import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getConsumerById, type Consumer } from '../data/consumerData'

/**
 * Load the current consumer profile driven by the URL.
 * The route pattern is `/consumers/:consumerId`; the display name is passed as
 * `?name=…` so the page can render whatever consumer the user clicked from the
 * DT panel, Meters list, or Cases table.
 *
 * This hook is the single API-integration point — swap the body of
 * `getConsumerById` in `data/consumerData.ts` when the backend is available.
 */
export function useConsumer(): { consumer: Consumer; loading: boolean; error: null } {
  const params = useParams<{ consumerId?: string }>()
  const [searchParams] = useSearchParams()
  const id = params.consumerId ?? 'K-000000'
  const displayName = searchParams.get('name') ?? undefined

  const consumer = useMemo(() => getConsumerById(id, displayName), [id, displayName])

  return { consumer, loading: false, error: null }
}
