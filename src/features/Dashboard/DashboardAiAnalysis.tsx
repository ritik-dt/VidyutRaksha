import { useNavigate } from 'react-router-dom'
import { useRole } from '@/context/RoleContext'
import { useScope } from '@/context/ScopeContext'
import { useToast } from '@/context/ToastContext'
import { getPathForScreen } from '@/utils/navigation'
import type { ScreenName } from '@/types'
import { getHierarchyInsight, getRoleAwareInsight } from './dashboardAdapter'

function InsightBody({ html }: { html: string }) {
  return (
    <div
      className="ai-insight-body text-[13.5px] leading-[1.65] text-text [&_strong]:font-bold [&_strong]:text-ai-purple"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default function DashboardAiAnalysis() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { currentRole } = useRole()
  const { hierPath } = useScope()

  const goTo = (screen: ScreenName) => {
    navigate(getPathForScreen(screen))
  }

  const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
  const insightHtml =
    getRoleAwareInsight('dashboard', currentRole.id) ??
    getHierarchyInsight(scopeId) ??
    'AI analysis for this level will be generated from the detection engine results.'

  return (
    <div className="ai-insight mb-4">
      <div className="ai-insight-header">
        AI analysis — {currentRole.label}
        <span className="ai-live-badge">Live</span>
      </div>

      <InsightBody html={insightHtml} />

      <div className="ai-insight-actions mt-2.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => goTo('meters')}
          className="btn btn-ai btn-sm px-[11px] py-[5px] text-[10.5px]"
        >
          ✦ Review top criticals →
        </button>
        <button
          type="button"
          onClick={() => {
            goTo('cases')
            showToast({
              type: 'success',
              title: 'Inspection assignment',
              message:
                'Opening team view to assign flagged meters to inspectors.',
            })
          }}
          className="btn btn-outline btn-sm px-[11px] py-[5px] text-[10.5px]"
        >
          Assign inspections
        </button>
        <button
          type="button"
          onClick={() => goTo('clusters')}
          className="btn btn-outline btn-sm px-[11px] py-[5px] text-[10.5px]"
        >
          View clusters
        </button>
      </div>
    </div>
  )
}
