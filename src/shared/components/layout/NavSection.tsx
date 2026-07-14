import type { KeyboardEvent } from 'react'
import { cn } from '@/shared/components/ui/cn'
import type { NavSectionConfig } from '@/shared/config/navConfig'
import type { ScreenName } from '@/shared/types'
import { NavButton } from './NavButton'

interface NavSectionProps {
  section: NavSectionConfig
  activeScreen: ScreenName
  collapsed: boolean
  isScreenVisible: (screen: ScreenName) => boolean
  onToggle: () => void
  /** Forwarded to each NavButton — used to close the mobile drawer. */
  onNavigate?: () => void
}

export function NavSection({
  section,
  activeScreen,
  collapsed,
  isScreenVisible,
  onToggle,
  onNavigate,
}: NavSectionProps) {
  const visibleItems = section.items.filter((item) =>
    isScreenVisible(item.screen),
  )

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div data-section={section.id}>
      {section.collapsible ? (
        <div
          className="flex cursor-pointer select-none items-center justify-between px-4 pb-1.5 pt-3.5 text-[9.5px] font-bold uppercase tracking-[1.4px] text-[#6e8aa6] transition-colors hover:text-[#9bb0c8]"
          onClick={onToggle}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              onToggle()
            }
          }}
          role="button"
          tabIndex={0}
        >
          {section.label}
          <span
            className={cn(
              'text-[10px] text-[#5b7893] transition-transform duration-200',
              collapsed && '-rotate-90',
            )}
          >
            ▾
          </span>
        </div>
      ) : (
        <div className="flex select-none items-center justify-between px-4 pb-1.5 pt-3.5 text-[9.5px] font-bold uppercase tracking-[1.4px] text-[#6e8aa6]">
          {section.label}
        </div>
      )}
      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-250 ease-out',
          collapsed
            ? 'pointer-events-none max-h-0 opacity-0'
            : 'max-h-[1200px] opacity-100',
        )}
      >
        {visibleItems.map((item) => (
          <NavButton
            key={item.screen}
            screen={item.screen}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            badgeVariant={item.badgeVariant}
            active={activeScreen === item.screen}
            visible
            dense={section.tools}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}
