import { useLocation } from 'react-router-dom'
import { NAV_SECTIONS } from '@/shared/config/navConfig'
import { cn } from '@/shared/components/ui/cn'
import { useRole } from '@/shared/context/RoleContext'
import { useNavCollapse } from '@/shared/hooks/useNavCollapse'
import { getActiveNavScreen } from '@/shared/utils/navigation'
import { NavSection } from './NavSection'

function SidebarLogo() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-4 py-[18px]">
      <div
        className="flex size-[34px] animate-ai-pulse items-center justify-center rounded-[9px] shadow-[0_0_18px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
        style={{ background: 'var(--ai-gradient)' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>

      <div>
        <div className="text-sm font-bold leading-tight tracking-wide text-white">
          VidyutRaksha
        </div>
        <div className="text-[9px] font-bold tracking-[1.5px] text-ai-purple-mid">
          AI-POWERED ANALYTICS
        </div>
      </div>
    </div>
  )
}

function SidebarUser() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-t border-white/[0.06] bg-black/15 px-4 py-3">
      <div
        className="flex size-8 items-center justify-center rounded-full text-[10.5px] font-bold tracking-wide text-white shadow-[0_0_0_2px_rgba(255,255,255,0.06)]"
        style={{
          background:
            'linear-gradient(135deg, var(--ai-purple) 0%, var(--ai-purple-dark) 100%)',
        }}
      >
        RM
      </div>

      <div>
        <div className="text-[11.5px] font-semibold leading-snug text-white">
          Rajiv Mehta
        </div>
        <div className="text-[10px] leading-snug text-[#7a93ab]">
          Vigilance Officer • UPPCL
        </div>
      </div>
    </div>
  )
}

interface SidebarProps {
  /** Whether the off-canvas drawer is open on small screens. */
  mobileOpen?: boolean
  /** Close the drawer (small screens only). */
  onClose?: () => void
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const { isScreenAllowed } = useRole()
  const { isSectionCollapsed, toggleSection } = useNavCollapse()
  const activeScreen = getActiveNavScreen(pathname)

  return (
    <>
      {/* Backdrop — small screens only, shown when the drawer is open */}
      <div
        className={cn(
          'fixed inset-0 z-40 cursor-pointer bg-black/50 transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)] transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        style={{ background: 'var(--grad-sidebar)' }}
      >
        {/* Close button — small screens only */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-3.5 right-3 z-10 flex size-7 items-center justify-center rounded-md text-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
        >
          ×
        </button>

        <SidebarLogo />

        <nav className="sidebar-nav flex-1 overflow-y-auto py-2 pb-1">
          {NAV_SECTIONS.map((section) => (
            <NavSection
              key={section.id}
              section={section}
              activeScreen={activeScreen}
              collapsed={isSectionCollapsed(section.id)}
              isScreenVisible={isScreenAllowed}
              onToggle={() => toggleSection(section.id)}
              onNavigate={onClose}
            />
          ))}
        </nav>

        <SidebarUser />
      </aside>
    </>
  )
}