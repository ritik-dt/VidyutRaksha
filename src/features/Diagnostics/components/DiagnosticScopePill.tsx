import { useScope } from '@/shared/context/ScopeContext'
import { useRole } from '@/shared/context/RoleContext'
import { formatIndian } from '@/shared/utils/formatters'
import { fmtINR } from '@/features/Dashboard/adapter'

interface DiagnosticScopePillProps {
  scopeName: string
  totalAffected: number
  totalImpact: number
}

export function DiagnosticScopePill({ scopeName, totalAffected, totalImpact }: DiagnosticScopePillProps) {
  const { toggleScopePicker } = useScope()
  const { currentRole } = useRole()

  return (
    <div
      className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
      style={{
        background: 'linear-gradient(90deg,rgba(124,58,237,0.05) 0%,rgba(124,58,237,0.01) 100%)',
        borderColor: 'rgba(124,58,237,0.15)',
      }}
    >
      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-dim">Scope:</span>
        <span className="rounded-md bg-[rgba(124,58,237,0.1)] px-2 py-0.5 font-bold text-ai-purple">
          ⦿ {scopeName}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10.5px] font-semibold text-text-mid">
          {formatIndian(totalAffected)} flagged · {fmtINR(totalImpact)}
        </span>
        <span className="text-[10px] text-text-dim">{currentRole.level} default</span>
        <button
          type="button"
          onClick={toggleScopePicker}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '10px', padding: '3px 9px', color: 'var(--ai-purple)', borderColor: 'rgba(124,58,237,0.3)' }}
        >
          ↕ Change scope
        </button>
      </div>
    </div>
  )
}
