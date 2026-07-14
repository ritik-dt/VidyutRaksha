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
        className="rebalance-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rebalance-modal-header">
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

        <div className="rebalance-modal-body">
          {suggestions.map((m, idx) => (
            <div key={`${m.src.id}-${m.dst.id}-${idx}`}>
              <div className="move-card">
                <div className="move-side" style={{ border: '1px solid rgba(220,53,69,.3)' }}>
                  <div className="move-side-name">{m.src.name}</div>
                  <div className="move-side-load">
                    {m.src.openCases}/{m.src.capacity} (
                    {Math.round((m.src.openCases / m.src.capacity) * 100)}%)
                    {m.src.status === 'leave' ? ' · ON LEAVE' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="move-arrow">→</div>
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
                <div className="move-side" style={{ border: '1px solid rgba(40,167,69,.3)' }}>
                  <div className="move-side-name">{m.dst.name}</div>
                  <div className="move-side-load">
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

        <div className="rebalance-modal-footer">
          <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>
            Each inspector &amp; affected consumer will be notified on apply.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
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
