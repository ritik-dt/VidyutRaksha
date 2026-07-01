import { useScope } from '@/shared/context/ScopeContext'
import { HIER_ICONS } from '@/data/hierarchy'
import type { ReactNode } from 'react'

interface ScopeBreadcrumbProps {
  rightActions?: ReactNode
}

export function ScopeBreadcrumb({ rightActions }: ScopeBreadcrumbProps) {
  const { hierPath, hierData, navigateToPathIndex } = useScope()

  if (!hierPath.length) return null

  return (
    <div
      className="mb-3.5 flex flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px]"
      style={{
        background: 'linear-gradient(90deg,rgba(124,58,237,0.05) 0%,rgba(124,58,237,0.01) 100%)',
        borderColor: 'rgba(124,58,237,0.15)',
      }}
    >
      <span
        className="mr-1 text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-dim"
      >
        Scope:
      </span>

      {hierPath.map((id, i) => {
        const node = hierData[id]
        if (!node) return null
        const isLast = i === hierPath.length - 1
        const icon = HIER_ICONS[node.type] ?? ''

        return (
          <span key={id} className="flex items-center gap-1.5">
            {isLast ? (
              <span
                className="rounded-md px-2 py-0.5 font-bold text-ai-purple"
                style={{ background: 'rgba(124,58,237,0.1)' }}
              >
                {icon} {node.name}
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigateToPathIndex(i)}
                  className="font-medium text-text-mid transition-colors hover:text-ai-purple"
                >
                  {icon} {node.name}
                </button>
                <span className="text-text-dim">›</span>
              </>
            )}
          </span>
        )
      })}

      <div className="ml-auto flex items-center gap-1.5">
        {/* <button
          type="button"
          onClick={toggleScopePicker}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '10px', padding: '3px 9px', color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
        >
          ↕ Change scope
        </button> */}
        {rightActions}
      </div>
    </div>
  )
}
