import { useMemo, useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import type { LayerVisibility, NavContext } from '../types'
import {
  computeKpis,
  enrichFeeders,
  getDtsInScope,
  getFeedersInScope,
  getRealMetersInScope,
} from '../logic/scopeFilters'

const DEFAULT_LAYERS: LayerVisibility = {
  feeders: true,
  dts: true,
  consumers: true,
  real: true,
  lines: true,
  heat: false,
}

const EMPTY_NAV: NavContext = { feeder: null, dt: null, consumer: null }

/** Network map state — scope-filtered assets + KPIs + layer toggles + detail nav. */
export function useNetworkMap() {
  const scope = useScope()

  const allFeeders = useMemo(() => getFeedersInScope(scope.hierPath), [scope.hierPath])
  const allDts = useMemo(() => getDtsInScope(scope.hierPath), [scope.hierPath])
  const realMeters = useMemo(() => getRealMetersInScope(scope.hierPath), [scope.hierPath])
  const realMetersCount = realMeters.length
  const enrichedFeeders = useMemo(() => enrichFeeders(allFeeders, allDts), [allFeeders, allDts])
  const kpis = useMemo(() => computeKpis(enrichedFeeders, allDts), [enrichedFeeders, allDts])

  const sortedFeeders = useMemo(
    () => [...enrichedFeeders].sort((a, b) => (b.loss || 0) - (a.loss || 0)),
    [enrichedFeeders],
  )
  const topHotspots = useMemo(() => sortedFeeders.slice(0, 6), [sortedFeeders])

  const isEmpty = allFeeders.length === 0
  const hasSynthetic = allFeeders.some((f) => f._synthetic)
  const hasReal = allFeeders.some((f) => !f._synthetic)
  const isAllSynthetic = hasSynthetic && !hasReal

  const scopeName = scope.currentNode?.name ?? 'UPPCL'

  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS)
  const toggleLayer = (id: keyof LayerVisibility) =>
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }))

  const [navCtx, setNavCtx] = useState<NavContext>(EMPTY_NAV)
  const closeDetail = () => setNavCtx(EMPTY_NAV)

  return {
    scope,
    scopeName,
    allFeeders,
    allDts,
    enrichedFeeders,
    kpis,
    topHotspots,
    isEmpty,
    hasSynthetic,
    isAllSynthetic,
    realMeters,
    realMetersCount,
    layers,
    toggleLayer,
    navCtx,
    setNavCtx,
    closeDetail,
  }
}
