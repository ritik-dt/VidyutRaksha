import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '@/shared/context/RoleContext'
import { useScope } from '@/shared/context/ScopeContext'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import type { ScreenName } from '@/shared/types'
import { getHierarchyInsight, getRoleAwareInsight } from '../adapter'

function InsightBody({ html }: { html: string }) {
  return (
    <div
      className="text-[13.5px] leading-[1.65] text-text [&_strong]:font-bold [&_strong]:text-ai-purple"
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
    <div
      className="relative mb-4 overflow-hidden rounded-[14px] border py-[18px] pl-[26px] pr-5 shadow-[0_2px_6px_rgba(124,58,237,0.08),0_12px_32px_-14px_rgba(124,58,237,0.22)]"
      style={{
        background:
          'linear-gradient(135deg, rgba(124,58,237,0.09) 0%, rgba(124,58,237,0.025) 50%, rgba(255,255,255,0) 100%), var(--card)',
        borderColor: 'rgba(124,58,237,0.35)',
      }}
    >
      {/* Top accent bar (was .ai-insight::before) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-[14px]"
        style={{ background: 'var(--ai-gradient)' }}
      />
      {/* Left gradient bar (was .ai-insight::after) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1.5 w-1.5"
        style={{
          height: 'calc(100% - 6px)',
          background:
            'linear-gradient(180deg, var(--ai-purple) 0%, rgba(124,58,237,0.3) 70%, rgba(124,58,237,0) 100%)',
        }}
      />

      <div className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.3px] text-ai-purple">
        {/* Sparkle icon (was .ai-insight-header::before, an SVG-mask pseudo-element).
         * Uses the ai-sparkle @keyframe from index.css (line 576) directly since
         * it isn't yet exposed as a Tailwind animate-* token. */}
        <Sparkles
          size={16}
          className="shrink-0 text-ai-purple"
          style={{ animation: 'ai-sparkle 3s ease-in-out infinite' }}
          aria-hidden="true"
        />
        AI analysis — {currentRole.label}
        <span
          className="ml-auto inline-flex items-center gap-1.5 rounded-[10px] border px-[9px] py-[3px] text-[9.5px] font-bold uppercase tracking-[0.4px] text-ai-purple"
          style={{
            background: 'rgba(124,58,237,0.12)',
            borderColor: 'rgba(124,58,237,0.3)',
          }}
        >
          {/* Pulsing dot (was .ai-live-badge::before) — uses ai-pulse-dot
           * @keyframe from index.css directly since the Tailwind
           * animate-pulse-dot token maps to the simpler `pulse-dot` keyframe
           * (opacity only). */}
          <span
            aria-hidden="true"
            className="inline-block size-1.5 rounded-full bg-ai-purple shadow-[0_0_8px_var(--ai-purple)]"
            style={{ animation: 'ai-pulse-dot 1.6s ease-in-out infinite' }}
          />
          Live
        </span>
      </div>

      <InsightBody html={insightHtml} />

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => goTo('meters')}
          className="cursor-pointer rounded-lg border-none px-[11px] py-[5px] text-[10.5px] font-semibold text-white shadow-[var(--ai-glow)] transition-all hover:opacity-85"
          style={{ background: 'var(--ai-gradient)' }}
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
          className="cursor-pointer rounded-lg border border-border bg-card px-[11px] py-[5px] text-[10.5px] font-semibold text-text-mid transition-all hover:opacity-85"
        >
          Assign inspections
        </button>
        <button
          type="button"
          onClick={() => goTo('clusters')}
          className="cursor-pointer rounded-lg border border-border bg-card px-[11px] py-[5px] text-[10.5px] font-semibold text-text-mid transition-all hover:opacity-85"
        >
          View clusters
        </button>
      </div>
    </div>
  )
}
