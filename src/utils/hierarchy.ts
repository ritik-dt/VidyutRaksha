import {
  DEFAULT_HIER_PATH,
  HIER_ROOT_ID,
  hierData,
} from '@/data/hierarchy'
import type { HierDataMap, HierNode, HierPath } from '@/types'
import type { ScreenName } from '@/types/navigation'

export const HIER_AWARE_SCREENS: ScreenName[] = [
  'dashboard',
  'meters',
  'cases',
  'diagnostics',
  'clusters',
  'dtload',
  'networkmap',
]

export function scopePathFor(
  id: string,
  data: HierDataMap = hierData,
): HierPath {
  if (!data[id]) {
    return []
  }

  const path: string[] = []
  let cur: string | null | undefined = id
  let safety = 0

  while (cur && safety < 20) {
    path.unshift(cur)
    cur = data[cur]?.parent ?? null
    safety += 1
  }

  return path
}

export function getNodeAtPath(
  path: HierPath,
  data: HierDataMap = hierData,
): HierNode | null {
  const id = path[path.length - 1]
  if (!id || !data[id]) {
    return null
  }
  return data[id]
}

export function getScopeLabel(
  path: HierPath,
  data: HierDataMap = hierData,
): string {
  return getNodeAtPath(path, data)?.name ?? 'UPPCL'
}

export function nodeMatchesFilter(
  nodeId: string,
  searchTerm: string,
  data: HierDataMap = hierData,
): boolean {
  const node = data[nodeId]
  if (!node) {
    return false
  }

  const normalized = searchTerm.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  if (node.name.toLowerCase().includes(normalized)) {
    return true
  }

  return (node.children ?? []).some((child) =>
    nodeMatchesFilter(child.id, searchTerm, data),
  )
}

export function isHierAwareScreen(screen: ScreenName): boolean {
  return HIER_AWARE_SCREENS.includes(screen)
}

export { DEFAULT_HIER_PATH, HIER_ROOT_ID, hierData }
