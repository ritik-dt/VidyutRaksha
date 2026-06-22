import { MapPin } from 'lucide-react'
import { useRole } from '@/shared/context/RoleContext'

export default function DashboardScopePill() {
  const { currentRole } = useRole()
  const scope = currentRole.defaultScope

  if (!scope || scope.type === 'state' || scope.type === 'all') {
    return null
  }

  return (
    <div className="dashboard-scope-pill mb-3 inline-flex items-center gap-1.5 rounded-[14px] border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.06)] px-2.5 py-1 text-[10.5px] font-semibold text-ai-purple">
      <MapPin size={11} strokeWidth={2.5} />
      <span>
        Scope: <strong>{scope.name}</strong>
      </span>
      <span className="font-normal text-text-dim">· {currentRole.level} default</span>
    </div>
  )
}
