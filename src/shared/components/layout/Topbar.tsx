import { useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/components/ui/cn'
// import { ScopePicker } from '@/shared/components/hierarchy/ScopePicker'
// import { useLanguage } from '@/shared/context/LanguageContext'
// import { useRole } from '@/shared/context/RoleContext'
// import { useScope } from '@/shared/context/ScopeContext'
import { useTheme } from '@/shared/context/ThemeContext'
// import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import { RoleMenu } from './RoleMenu'

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate()
  // const { currentRole } = useRole()
  // const { scopeLabel, toggleScopePicker } = useScope()
  // const scopePickerRef = useRef<HTMLButtonElement>(null)
  // const { language, isHindi, toggleLanguage } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  // const { showToast } = useToast()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const roleSwitcherRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      className="relative flex h-[54px] shrink-0 items-center justify-between border-b border-border bg-card px-5"
      id="topbar"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Mobile: hamburger + brand (sidebar is hidden below lg) */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-text-mid transition-colors hover:border-ai-purple hover:text-ai-purple lg:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-lg shadow-[0_0_12px_rgba(124,58,237,0.25)]"
            style={{ background: 'var(--ai-gradient)' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          <span className="truncate text-[13px] font-bold text-text">
            VidyutRaksha
          </span>
        </div>

        {/* Search — hidden on small screens */}
        <div className="relative hidden max-w-[580px] flex-1 md:block">
          <svg
            className="absolute top-[9px] left-3"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B95A5"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="w-full rounded-3xl border-[1.5px] border-border bg-bg py-2 pr-3 pl-9 font-sans text-[13px] transition-[border-color,box-shadow] placeholder:text-text-dim focus:border-ai-purple focus:shadow-[var(--ai-glow)] focus:outline-none"
            placeholder="Ask AI: 'Show meters with earth loading in Chowk Division' or search anything..."
          />
          <span
            className="absolute top-1.25 right-2 rounded-xl px-2.5 py-0.75 text-[10px] font-semibold tracking-wide text-white"
            style={{ background: 'var(--ai-gradient)' }}
          >
            ✦ AI
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">

        {/* <button
          type="button"
          id="scopePicker"
          ref={scopePickerRef}
          onClick={toggleScopePicker}
          title="Change scope"
          className="flex cursor-pointer items-center gap-[7px] rounded-[18px] border border-[rgba(124,58,237,0.25)] px-[11px] py-[5px] pl-[9px] text-[11.5px] font-semibold text-ai-purple transition-all"
          style={{
            background:
              'linear-gradient(95deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.03) 100%)',
          }}
        >
          <span className="text-[13px]">📍</span>
          <span
            id="scopePickerLabel"
            className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {scopeLabel}
          </span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="shrink-0 opacity-70"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button> */}

        {/* <button
          type="button"
          id="roleSwitcher"
          ref={roleSwitcherRef}
          onClick={() => setRoleMenuOpen((open: boolean) => !open)}
          title="Switch role"
          className="flex cursor-pointer items-center gap-2 rounded-[18px] border border-border bg-bg px-2.5 py-[5px] pl-[5px] text-[11.5px] text-text transition-all"
        >
          <span
            className="flex size-[26px] shrink-0 items-center justify-center rounded-full text-[13px] text-white"
            style={{ background: 'var(--ai-gradient)' }}
          >
            {currentRole.icon}
          </span>
          <span
            id="rolePill"
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="rounded-[10px] bg-[rgba(124,58,237,.15)] px-[7px] py-0.5 text-[10px] font-extrabold tracking-wide text-ai-purple">
              {currentRole.level}
            </span>
            <span className="font-bold">{currentRole.label}</span>
            <span className="ml-1.5 text-[10.5px] text-text-dim">
              {currentRole.scope}
            </span>
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="ml-0.5 shrink-0 text-text-dim"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button> */}

        {/* <button
          type="button"
          className={cn(
            'flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] text-text-mid transition-all hover:border-ai-purple hover:text-ai-purple',
            isHindi && 'border-ai-purple bg-ai-purple text-white',
          )}
          id="langBtn"
          onClick={toggleLanguage}
          title={isHindi ? 'Switch to English' : 'Switch to Hindi'}
        >
          {language === 'HI' ? '🌐 हिं' : '🌐 EN'}
        </button> */}

        <button
          type="button"
          className={cn(
            'flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] text-text-mid transition-all hover:border-ai-purple hover:text-ai-purple',
            isDark && 'border-ai-purple bg-ai-purple text-white',
          )}
          id="themeBtn"
          onClick={toggleTheme}
          title="Toggle dark mode"
        >
          {isDark ? '🌙' : '☀️'}
        </button>

        {/* <button
          type="button"
          onClick={() => {
            showToast({
              type: 'ai',
              title: '✦ Guided tour',
              message:
                'Interactive product tour overlay will be migrated in Phase 7.',
              duration: 5000,
            })
          }}
          className="flex cursor-pointer items-center gap-1 rounded-2xl border-none px-3 py-[5px] text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)]"
          style={{ background: 'var(--ai-gradient)' }}
        >
          ✦ Tour
        </button> */}

        <div
          className="relative cursor-pointer"
          onClick={() => navigate(getPathForScreen('notifications'))}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              navigate(getPathForScreen('notifications'))
            }
          }}
          role="button"
          tabIndex={0}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4A5568"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-ai-purple text-[8px] font-bold text-white">
            4
          </div>
        </div>

        {/* <button
          type="button"
          onClick={() => {
            showToast({
              type: 'info',
              title: 'Real DISCOM data inside',
              message:
                'Prototype includes a real meter dump (1,371 tamper events from KVVNL Mar 2026 + 60-day load survey for Meter #1849966). Click any case marked ✓ REAL or open Meter #1849966 to see actual MRI data.',
              duration: 6000,
            })
          }}
          className="flex cursor-pointer items-center gap-[5px] rounded-[14px] border border-[rgba(40,167,69,0.3)] px-2.5 py-1 text-[10px] font-bold tracking-wide text-green"
          style={{
            background:
              'linear-gradient(95deg, rgba(40, 167, 69, 0.12), rgba(40, 167, 69, 0.06))',
          }}
          title="Click for source details"
        >
          ✓ REAL DATA
        </button> */}

        {/* <div className="rounded-md bg-green-light px-2.5 py-1 text-[10px] font-semibold text-green">
          UPPCL Pilot
        </div> */}

      </div>

      <RoleMenu
        open={roleMenuOpen}
        onClose={() => setRoleMenuOpen(false)}
        anchorRef={roleSwitcherRef}
      />

      {/* <ScopePicker anchorRef={scopePickerRef} /> */}

    </div>
  )
}
