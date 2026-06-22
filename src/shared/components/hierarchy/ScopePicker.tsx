import { useEffect, useRef, useState, type RefObject, type MouseEvent, type ChangeEvent, type FocusEvent } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { ScopeTree } from './ScopeTree'

interface ScopePickerProps {
  anchorRef: RefObject<HTMLButtonElement | null>
}

export function ScopePicker({ anchorRef }: ScopePickerProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const {
    scopePickerOpen,
    closeScopePicker,
    hierPath,
    scopeLabel,
    expandedNodes,
    jumpToScope,
    toggleScopeNode,
    resetScope,
  } = useScope()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!scopePickerOpen) {
      setSearchTerm('')
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
      closeScopePicker()
    }

    const timeoutId = window.setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [scopePickerOpen, closeScopePicker, anchorRef])

  if (!scopePickerOpen) {
    return null
  }

  return (
    <div
      ref={menuRef}
      id="scopeMenu"
      style={{
        position: 'absolute',
        top: 46,
        right: 14,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        boxShadow: '0 12px 32px rgba(10,25,50,.18)',
        zIndex: 9990,
        width: 380,
        maxWidth: 'calc(100vw - 28px)',
        maxHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'popIn .18s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '11px 14px 10px',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: 0.3,
              }}
            >
              CHANGE SCOPE
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-dim)',
                marginTop: 2,
              }}
            >
              Currently viewing:{' '}
              <strong style={{ color: 'var(--ai-purple)' }}>{scopeLabel}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={closeScopePicker}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              fontSize: 18,
              lineHeight: 1,
              padding: '2px 6px',
              borderRadius: 4,
            }}
            onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
              event.currentTarget.style.background = 'var(--bg)'
            }}
            onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
              event.currentTarget.style.background = 'transparent'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 9,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              fontSize: 12,
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>
          <input
            id="scopeSearch"
            value={searchTerm}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
            placeholder="Search scope (e.g. Bhelupur, Varanasi, Industrial)…"
            style={{
              width: '100%',
              padding: '6px 10px 6px 28px',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 11.5,
              background: 'var(--bg)',
              fontFamily: 'var(--font)',
            }}
            onFocus={(event: FocusEvent<HTMLInputElement>) => {
              event.currentTarget.style.borderColor = 'var(--ai-purple)'
              event.currentTarget.style.background = '#fff'
            }}
            onBlur={(event: FocusEvent<HTMLInputElement>) => {
              event.currentTarget.style.borderColor = 'var(--border)'
              event.currentTarget.style.background = 'var(--bg)'
            }}
          />
        </div>
      </div>
      <div
        id="scopeTreeContainer"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px 10px',
        }}
      >
        <ScopeTree
          currentPath={hierPath}
          expandedSet={expandedNodes}
          searchTerm={searchTerm}
          onJump={jumpToScope}
          onToggleExpand={toggleScopeNode}
        />
      </div>
      <div
        style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--bg)',
          fontSize: 10,
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Click any node to jump · ▶ to expand</span>
        {hierPath.length > 1 ? (
          <button
            type="button"
            onClick={resetScope}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ai-purple)',
              fontSize: 10.5,
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ↺ Reset to UPPCL
          </button>
        ) : null}
      </div>
    </div>
  )
}
