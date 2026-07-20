import { HIER_ICONS } from '@/data/hierarchy'
import { useScope } from '@/shared/context/ScopeContext'

export default function DashboardBreadcrumb() {
  const { hierPath, hierData, navigateToPathIndex } = useScope()

  if (hierPath.length <= 1) {
    return null
  }

  return (
    <div className="mb-3.5 flex flex-wrap items-center py-2 text-[11px]">
      {hierPath.map((pathId, index) => {
        const node = hierData[pathId]
        if (!node) return null

        const icon = HIER_ICONS[node.type] ?? ''
        const isLast = index === hierPath.length - 1

        return (
          <span key={pathId} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-1 text-[10px] text-text-dim">›</span>
            )}
            {isLast ? (
              <span className="cursor-default px-1.5 py-0.5 font-semibold text-text">
                {icon} {node.name}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => navigateToPathIndex(index)}
                className="cursor-pointer border-none bg-transparent p-0 font-medium text-id-text hover:text-ai-purple-mid"
              >
                {icon} {node.name}
              </button>
            )}
          </span>
        )
      })}
    </div>
  )
}
