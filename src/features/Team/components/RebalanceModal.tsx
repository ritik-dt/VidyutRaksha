import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { RebalanceMove, TeamInspector } from '../types'

interface RebalanceModalProps {
  suggestions: RebalanceMove[]
  inspectors: TeamInspector[]
  onClose: () => void
  onApply: (moves: RebalanceMove[]) => void
}

/**
 * Centered popIn modal previewing AI-suggested rebalance moves. Port of the
 * prototype's openRebalanceModal(). Includes the "Net effect" summary and a
 * two-button footer (Cancel / Apply N moves).
 *
 * The popIn keyframe animation is defined globally in index.css (it's a
 * declarative keyframe, not a class rule).
 * Footer stacks at ≤480px to give the buttons full width.
 */
export function RebalanceModal({ suggestions, inspectors, onClose, onApply }: RebalanceModalProps) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const totalMoves = suggestions.reduce((s, m) => s + m.caseCount, 0)
  const pairPlural = suggestions.length === 1 ? '' : 's'
  const movePlural = totalMoves === 1 ? '' : 's'

  const worstNow = Math.round(
    inspectors.reduce((s, i) => Math.max(s, i.openCases / i.capacity), 0) * 100,
  )
  const teamUtil =
    Math.round(
      (inspectors.reduce((s, i) => s + i.openCases, 0) /
        inspectors.reduce((s, i) => s + i.capacity, 0)) *
        100,
    ) + 10
  const slaReducedBy = Math.min(
    totalMoves,
    inspectors.reduce((s, i) => s + i.pastSla, 0),
  )

  return createPortal(
    <>
      <div className="assign-backdrop" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 z-[99991] bg-[var(--card)] rounded-[14px] w-[680px] max-w-[92vw] max-h-[88vh] flex flex-col [animation:popIn_0.2s_ease] shadow-[0_30px_80px_rgba(10,25,50,0.4)]"
        style={{ transform: 'translate(-50%, -50%)' }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="py-[18px] px-[22px] border-b border-[var(--border)] rounded-t-[14px]"
          style={{
            background:
              'linear-gradient(95deg, var(--ai-purple-light) 0%, var(--card) 60%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                ✦ AI auto-rebalance
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 4 }}>
                I propose {totalMoves} case move{movePlural} across {suggestions.length}{' '}
                pair{pairPlural} of inspectors. Review before applying.
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: 22,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-[18px] px-[22px]">
          {suggestions.map((m, idx) => (
            <div key={`${m.src.id}-${m.dst.id}-${idx}`}>
              <div className="flex items-center gap-3 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg mb-2">
                <div
                  className="flex-1 text-center py-2 px-[10px] bg-[var(--card)] rounded-md"
                  style={{ border: '1px solid rgba(220,53,69,.3)' }}
                >
                  <div className="text-[12px] font-bold text-[var(--text)] mb-[2px]">
                    {m.src.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)]">
                    {m.src.openCases}/{m.src.capacity} (
                    {Math.round((m.src.openCases / m.src.capacity) * 100)}%)
                    {m.src.status === 'leave' ? ' · ON LEAVE' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="text-[18px] text-[var(--ai-purple)] font-bold">→</div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--ai-purple)',
                      marginTop: 2,
                    }}
                  >
                    {m.caseCount} case{m.caseCount > 1 ? 's' : ''}
                  </div>
                </div>
                <div
                  className="flex-1 text-center py-2 px-[10px] bg-[var(--card)] rounded-md"
                  style={{ border: '1px solid rgba(40,167,69,.3)' }}
                >
                  <div className="text-[12px] font-bold text-[var(--text)] mb-[2px]">
                    {m.dst.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)]">
                    {m.dst.openCases}/{m.dst.capacity} (
                    {Math.round((m.dst.openCases / m.dst.capacity) * 100)}%)
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: 'var(--text-mid)',
                  margin: '-4px 0 12px 4px',
                  paddingLeft: 8,
                  borderLeft: '2px solid var(--ai-purple-light)',
                }}
              >
                <strong style={{ color: 'var(--ai-purple)' }}>Why:</strong> {m.reason}
              </div>
            </div>
          ))}
          <div
            style={{
              padding: '10px 12px',
              background: 'var(--ai-purple-light)',
              borderRadius: 6,
              fontSize: 11,
              color: 'var(--ai-purple)',
              marginTop: 6,
            }}
          >
            <strong>Net effect:</strong> Team capacity utilization will balance from{' '}
            <strong>{worstNow}% (worst inspector)</strong> to ~<strong>{teamUtil}% (worst inspector)</strong>{' '}
            after moves. Past-SLA cases will reduce by {slaReducedBy}.
          </div>
        </div>

        {/* Footer wraps to full-width column at ≤480px per prototype. */}
        <div className="py-[14px] px-[22px] border-t border-[var(--border)] flex justify-between items-center gap-[10px] max-[480px]:flex-wrap">
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>
            Each inspector &amp; affected consumer will be notified on apply.
          </span>
          <div className="flex gap-2 max-[480px]:w-full max-[480px]:[&>button]:flex-1">
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--text-mid)',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onApply(suggestions)}
              style={{
                padding: '8px 18px',
                background: 'var(--ai-gradient)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✓ Apply {totalMoves} move{movePlural}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
