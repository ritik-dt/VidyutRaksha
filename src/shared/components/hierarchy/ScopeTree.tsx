import { HIER_ROOT_ID } from '@/data/hierarchy'
import type { HierPath } from '@/shared/types'
import { ScopeTreeNode } from './ScopeTreeNode'

interface ScopeTreeProps {
  currentPath: HierPath
  expandedSet: Set<string>
  searchTerm: string
  onJump: (nodeId: string) => void
  onToggleExpand: (nodeId: string) => void
}

export function ScopeTree({
  currentPath,
  expandedSet,
  searchTerm,
  onJump,
  onToggleExpand,
}: ScopeTreeProps) {
  return (
    <ScopeTreeNode
      nodeId={HIER_ROOT_ID}
      currentPath={currentPath}
      expandedSet={expandedSet}
      searchTerm={searchTerm}
      onJump={onJump}
      onToggleExpand={onToggleExpand}
    />
  )
}
