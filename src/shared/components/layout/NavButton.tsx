import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/components/ui/cn'
import type { NavBadgeVariant } from '@/shared/config/navConfig'
import type { ScreenName } from '@/shared/types'
import { getPathForScreen } from '@/shared/utils/navigation'

interface NavButtonProps {
  screen: ScreenName
  icon: string
  label: string
  active: boolean
  visible?: boolean
  badge?: string
  badgeVariant?: NavBadgeVariant
  dense?: boolean
  /** Called after navigating — used to close the mobile drawer. */
  onNavigate?: () => void
}

function badgeClasses(variant: NavBadgeVariant | undefined): string {
  const base =
    'ml-auto shrink-0 rounded-[9px] px-[7px] py-px font-mono text-[9.5px] font-bold leading-snug tracking-wide text-white'
  if (variant === 'amber') {
    return cn(
      base,
      'bg-amber shadow-[0_0_0_1px_rgba(230,146,30,0.3),0_1px_2px_rgba(0,0,0,0.2)]',
    )
  }
  if (variant === 'purple') {
    return cn(
      base,
      'bg-ai-purple shadow-[0_0_0_1px_rgba(124,58,237,0.3),0_1px_2px_rgba(0,0,0,0.2)]',
    )
  }
  if (variant === 'dim') {
    return cn(base, 'bg-white/[0.08] font-semibold text-[#9aaec5] shadow-none')
  }
  return cn(
    base,
    'bg-red shadow-[0_0_0_1px_rgba(220,53,69,0.3),0_1px_2px_rgba(0,0,0,0.2)]',
  )
}

export function NavButton({
  screen,
  icon,
  label,
  active,
  visible = true,
  badge,
  badgeVariant,
  dense = false,
  onNavigate,
}: NavButtonProps) {
  const navigate = useNavigate()

  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      className={cn(
        'relative flex w-full items-center gap-2.5 border-l-[3px] border-transparent text-left font-sans transition-[background,color,border-color] duration-[120ms]',
        dense
          ? 'px-4 py-[7px] pl-[18px] text-[11.5px] font-medium text-[#7a93ab] [&_.nav-icon]:text-xs [&_.nav-icon]:opacity-80 hover:text-[#a8bdd2]'
          : 'px-4 py-[9px] pl-[18px] text-[12.5px] font-medium text-[#9aaec5] hover:bg-white/[0.04] hover:text-[#cad7e5] [&_.nav-icon]:saturate-75 hover:[&_.nav-icon]:saturate-100',
        active &&
          (dense
            ? 'text-white'
            : 'border-l-ai-purple-mid bg-gradient-to-r from-[rgba(124,58,237,0.18)] to-[rgba(124,58,237,0.04)] text-white shadow-[inset_0_0_0_1px_rgba(124,58,237,0.08)] [&_.nav-icon]:saturate-[1.2] [&_.nav-icon]:brightness-110'),
      )}
      onClick={() => {
        navigate(getPathForScreen(screen))
        onNavigate?.()
      }}
    >
      <span className="nav-icon w-[18px] shrink-0 text-center text-sm leading-none">
        {icon}
      </span>
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      {badge ? (
        <span className={badgeClasses(badgeVariant)} data-counter={screen}>
          {badge}
        </span>
      ) : null}
    </button>
  )
}
