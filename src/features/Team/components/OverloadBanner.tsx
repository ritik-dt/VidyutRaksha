import type { TeamInspector } from '../types'

interface OverloadBannerProps {
  overloaded: TeamInspector[]
}

/**
 * Red banner listing the overloaded inspector names + their capacity %.
 * Shown only when at least one inspector is overloaded. Port of the prototype's
 * .ld-overload-banner block in renderTeamScreen.
 */
export function OverloadBanner({ overloaded }: OverloadBannerProps) {
  if (overloaded.length === 0) return null
  const names = overloaded
    .map((i) => `${i.name} (${Math.round((i.openCases / i.capacity) * 100)}%)`)
    .join(', ')
  const verb = overloaded.length > 1 ? 'inspectors are' : 'inspector is'

  return (
    <div
      className="rounded-lg py-[10px] px-[14px] mb-[14px] text-[11.5px] text-[var(--red)] flex items-center gap-2"
      style={{
        background:
          'linear-gradient(95deg, rgba(220, 53, 69, 0.05) 0%, rgba(255, 255, 255, 1) 60%)',
        border: '1px solid rgba(220, 53, 69, 0.25)',
        borderLeft: '3px solid var(--red)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <strong>{overloaded.length} {verb} overloaded:</strong> {names}. Click{' '}
        <strong>✦ AI auto-rebalance</strong> for suggested moves.
      </div>
    </div>
  )
}
