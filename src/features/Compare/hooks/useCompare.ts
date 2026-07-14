import { useMemo, useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { DEFAULT_PEER_FEEDERS } from '../data/peerData'
import type { CompareTabId, PeerFeeder, PeerScopeId } from '../types'

/** Compare state — active tab + scope select + selected peers. */
export function useCompare() {
  const scope = useScope()
  const [activeTab, setActiveTab] = useState<CompareTabId>('peer')
  const [peerScope, setPeerScope] = useState<PeerScopeId>('feeders')
  const [selectedPeers, setSelectedPeers] = useState<PeerFeeder[]>(DEFAULT_PEER_FEEDERS)

  function removePeer(id: string) {
    setSelectedPeers((prev) => prev.filter((p) => p.id !== id))
  }

  const scopeName = useMemo(() => {
    // Prototype hardcodes "Varanasi Zone" for the pilot; fall back to current level name.
    return scope.currentNode?.name === 'UPPCL' ? 'Varanasi Zone' : scope.currentNode?.name ?? 'Varanasi Zone'
  }, [scope.currentNode])

  return {
    activeTab,
    setActiveTab,
    scope,
    scopeName,
    peerScope,
    setPeerScope,
    selectedPeers,
    setSelectedPeers,
    removePeer,
  }
}
