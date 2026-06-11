import { HIER_ICONS } from '@/data/hierarchy'
import { useScope } from '@/context/ScopeContext'

export default function DashboardBreadcrumb() {
  const { hierPath, hierData, navigateToPathIndex } = useScope()

  if (hierPath.length <= 1) {
    return null
  }

  return (
    <div className="map-breadcrumb mb-3.5 flex flex-wrap items-center text-[11px]">
      {hierPath.map((pathId, index) => {
        const node = hierData[pathId]
        if (!node) return null

        const icon = HIER_ICONS[node.type] ?? ''
        const isLast = index === hierPath.length - 1

        return (
          <span key={pathId} className="inline-flex items-center">
            {index > 0 && (
              <span className="map-bc-sep mx-1 text-text-dim">›</span>
            )}
            {isLast ? (
              <span className="map-bc-current font-semibold text-text">
                {icon} {node.name}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => navigateToPathIndex(index)}
                className="map-bc-item cursor-pointer border-none bg-transparent p-0 font-medium text-id-text hover:text-ai-purple-mid"
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
