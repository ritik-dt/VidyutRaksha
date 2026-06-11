import { HIER_ICONS } from '@/data/hierarchy'
import type { HierPath } from '@/types'
import { hierData, nodeMatchesFilter } from '@/utils/hierarchy'

interface ScopeTreeNodeProps {
  nodeId: string
  currentPath: HierPath
  expandedSet: Set<string>
  searchTerm: string
  onJump: (nodeId: string) => void
  onToggleExpand: (nodeId: string) => void
}

export function ScopeTreeNode({
  nodeId,
  currentPath,
  expandedSet,
  searchTerm,
  onJump,
  onToggleExpand,
}: ScopeTreeNodeProps) {
  const node = hierData[nodeId]
  if (!node) {
    return null
  }

  if (searchTerm && !nodeMatchesFilter(nodeId, searchTerm)) {
    return null
  }

  const isCurrent = currentPath[currentPath.length - 1] === nodeId
  const onPath = currentPath.includes(nodeId)
  const childIds = node.children?.map((child) => child.id) ?? []
  const hasChildren = childIds.length > 0
  const isExpanded = searchTerm ? true : expandedSet.has(nodeId) || onPath
  const icon = HIER_ICONS[node.type] ?? '•'

  return (
    <div className="scope-node" data-id={nodeId}>
      <div
        className="scope-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 8px',
          borderRadius: 6,
          cursor: 'pointer',
          background: isCurrent ? 'var(--ai-purple-light)' : undefined,
        }}
        onClick={() => onJump(nodeId)}
        onMouseEnter={(event) => {
          if (!isCurrent) {
            event.currentTarget.style.background = 'var(--bg)'
          }
        }}
        onMouseLeave={(event) => {
          if (!isCurrent) {
            event.currentTarget.style.background = 'transparent'
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onJump(nodeId)
          }
        }}
        role="button"
        tabIndex={0}
      >
        {hasChildren ? (
          <span
            className="scope-chevron"
            onClick={(event) => {
              event.stopPropagation()
              onToggleExpand(nodeId)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                event.stopPropagation()
                onToggleExpand(nodeId)
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--text-dim)',
              transition: 'transform .15s',
              transform: isExpanded ? 'rotate(90deg)' : undefined,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = 'rgba(0,0,0,0.05)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = 'transparent'
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </span>
        ) : (
          <span style={{ display: 'inline-block', width: 18, height: 18 }} />
        )}
        <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 11.5,
            fontWeight: isCurrent ? 700 : 500,
            color: isCurrent ? 'var(--ai-purple)' : 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.name}
        </span>
        <span
          style={{
            fontSize: 9.5,
            color: 'var(--text-dim)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
            flexShrink: 0,
          }}
        >
          {node.type}
        </span>
        {hasChildren ? (
          <span
            style={{
              fontSize: 10,
              color: 'var(--text-dim)',
              background: 'var(--bg)',
              padding: '1px 6px',
              borderRadius: 8,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {childIds.length}
          </span>
        ) : null}
        {isCurrent ? (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ai-purple)"
            strokeWidth="3"
            style={{ flexShrink: 0 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </div>
      {hasChildren && isExpanded ? (
        <div
          className="scope-children"
          style={{
            marginLeft: 18,
            borderLeft: '1px solid var(--border-light)',
            paddingLeft: 6,
            marginTop: 1,
          }}
        >
          {childIds.map((childId) => (
            <ScopeTreeNode
              key={childId}
              nodeId={childId}
              currentPath={currentPath}
              expandedSet={expandedSet}
              searchTerm={searchTerm}
              onJump={onJump}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
