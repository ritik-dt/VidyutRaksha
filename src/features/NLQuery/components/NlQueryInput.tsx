import type { ChangeEvent, KeyboardEvent } from 'react'

interface NlQueryInputProps {
  value: string
  onChange: (v: string) => void
  /** Fires on send-button click or Enter key. */
  onSubmit: () => void
}

/**
 * Rounded pill-shaped input with a 34×34 gradient send-button glued to the
 * right (paper-plane SVG). Port of the prototype's input block.
 *
 * The prototype's input + button have no handlers wired; we wire `onSubmit`
 * for consistency with sibling modules' dead-AI-button pattern (toast).
 */
export function NlQueryInput({ value, onChange, onSubmit }: NlQueryInputProps) {
  return (
    <div className="relative mb-[18px]">
      <input
        className="form-input w-full"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') onSubmit()
        }}
        style={{
          padding: '12px 48px 12px 16px',
          borderRadius: '24px',
          border: '2px solid var(--ai-purple)',
          fontSize: '13px',
        }}
      />
      <button
        type="button"
        aria-label="Send query"
        onClick={onSubmit}
        className="cursor-pointer border-none"
        style={{
          position: 'absolute',
          right: 8,
          top: 7,
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'var(--ai-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  )
}
