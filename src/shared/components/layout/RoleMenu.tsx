import { useEffect, useRef, type RefObject, type MouseEvent } from 'react'
import { ROLES } from '@/data/roles'
import { useRole } from '@/shared/context/RoleContext'
import type { RoleId } from '@/shared/types'

interface RoleMenuProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
}

export function RoleMenu({ open, onClose, anchorRef }: RoleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { currentRole, setCurrentRole } = useRole()

  useEffect(() => {
    if (!open) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return
      }
      onClose()
    }

    const timeoutId = window.setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open, onClose, anchorRef])

  if (!open) {
    return null
  }

  const handleSelect = (roleId: RoleId) => {
    setCurrentRole(roleId)
    onClose()
  }

  return (
    <div
      ref={menuRef}
      id="roleMenu"
      style={{
        position: 'absolute',
        top: 46,
        right: 14,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: '0 12px 32px rgba(10,25,50,.18)',
        zIndex: 9990,
        width: 340,
        padding: 6,
        animation: 'popIn .18s ease',
      }}
    >
      <div
        style={{
          padding: '10px 12px 8px',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: 0.3,
          }}
        >
          SWITCH ROLE
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-dim)',
            marginTop: 2,
          }}
        >
          Demo: see the product through 6 different lenses
        </div>
      </div>
      {ROLES.map((role) => {
        const selected = role.id === currentRole.id
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => handleSelect(role.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '9px 12px',
              borderRadius: 7,
              cursor: 'pointer',
              transition: 'background .12s',
              background: selected ? 'var(--ai-purple-light)' : 'transparent',
              border: 'none',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
              event.currentTarget.style.background = selected
                ? 'var(--ai-purple-light)'
                : 'var(--bg)'
            }}
            onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
              event.currentTarget.style.background = selected
                ? 'var(--ai-purple-light)'
                : 'transparent'
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: selected ? 'var(--ai-gradient)' : 'var(--bg)',
                color: selected ? '#fff' : 'var(--text-mid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {role.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}
                >
                  {role.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    background: 'rgba(124,58,237,.12)',
                    color: 'var(--ai-purple)',
                    padding: '1px 6px',
                    borderRadius: 8,
                    letterSpacing: 0.3,
                  }}
                >
                  {role.level}
                </span>
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--text-dim)',
                  lineHeight: 1.4,
                }}
              >
                {role.description}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-mid)',
                  marginTop: 3,
                }}
              >
                📍 {role.scope}
              </div>
            </div>
            {selected ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ai-purple)"
                strokeWidth="3"
                style={{ flexShrink: 0 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : null}
          </button>
        )
      })}
      <div
        style={{
          padding: '8px 12px 4px',
          marginTop: 4,
          borderTop: '1px solid var(--border-light)',
          fontSize: 10,
          color: 'var(--text-dim)',
        }}
      >
        Sidebar items + landing screen will adapt to the selected role.
      </div>
    </div>
  )
}
