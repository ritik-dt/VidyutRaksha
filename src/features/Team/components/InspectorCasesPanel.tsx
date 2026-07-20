import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { getPathForScreen } from '@/shared/utils/navigation'
import { capacityTier } from '../logic/teamLogic'
import { getInspectorCases } from '../data/inspectorCases'
import type { InspectorGeneratedCase, TeamInspector } from '../types'

interface InspectorCasesPanelProps {
  inspector: TeamInspector
  onClose: () => void
  onReassign: (cs: InspectorGeneratedCase) => void
  onBulkReassign: () => void
}

const STATUS_TEXT: Record<TeamInspector['status'], string> = {
  field: 'In field',
  office: 'In office',
  leave: 'On leave',
}

function riskClass(risk: number): string {
  if (risk >= 70) return 'risk-circle risk-high'
  if (risk >= 40) return 'risk-circle risk-mid'
  return 'risk-circle risk-low'
}

/**
 * Slide-in side panel showing the inspector's open-cases list. Uses the same
 * `.assign-panel` / `.assign-backdrop` / `.assign-header` / `.assign-body`
 * shared CSS as ReassignInspectorPanel and DtDetailModal.
 */
export function InspectorCasesPanel({
  inspector,
  onClose,
  onReassign,
  onBulkReassign,
}: InspectorCasesPanelProps) {
  const navigate = useNavigate()

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const cases = useMemo(() => getInspectorCases(inspector), [inspector])
  const util = inspector.openCases / inspector.capacity
  const utilPct = Math.round(util * 100)
  const tier = capacityTier(util)
  const capClass = `capacity-${tier}`
  const capColor =
    tier === 'ok' ? 'var(--green)' : tier === 'mid' ? 'var(--amber)' : 'var(--red)'

  const openCaseDetail = (id: string) => {
    onClose()
    navigate(getPathForScreen('caseDetail', id))
  }

  return createPortal(
    <>
      <div className="assign-backdrop" onClick={onClose} />
      <div className="assign-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="assign-header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ld-avatar" style={{ width: 44, height: 44, fontSize: 14 }}>
                {inspector.init}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
                  {inspector.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-mid)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 2,
                  }}
                >
                  <span
                    className="inline-block w-[7px] h-[7px] rounded-full"
                    style={{
                      background:
                        inspector.status === 'field'
                          ? 'var(--green)'
                          : inspector.status === 'office'
                            ? 'var(--navy-light)'
                            : 'var(--text-dim)',
                    }}
                  />
                  {STATUS_TEXT[inspector.status]} · {inspector.statusDetail}
                </div>
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
                padding: '0 4px',
              }}
            >
              ×
            </button>
          </div>

          <div className="capacity-row" style={{ marginTop: 10, marginBottom: 0 }}>
            <div className="capacity-bar">
              <div
                className={`capacity-fill ${capClass}`}
                style={{ width: `${Math.min(100, utilPct)}%` }}
              />
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: capColor,
                minWidth: 60,
                textAlign: 'right',
              }}
            >
              {utilPct}%
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 10,
              fontSize: 11,
              color: 'var(--text-mid)',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <strong style={{ color: 'var(--text)' }}>
                {inspector.openCases}/{inspector.capacity}
              </strong>{' '}
              open
            </span>
            {inspector.pastSla > 0 && (
              <span>
                <strong style={{ color: 'var(--red)' }}>{inspector.pastSla}</strong> overdue
              </span>
            )}
            <span>
              <strong style={{ color: 'var(--text)' }}>{inspector.hitRate.toFixed(0)}%</strong> hit rate
            </span>
            <span>
              <strong style={{ color: 'var(--text)' }}>{inspector.avgClose}d</strong> avg close
            </span>
            <span style={{ marginLeft: 'auto' }}>📍 {inspector.areas.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Body */}
        <div className="assign-body">
          {inspector.openCases === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>📋</div>
              <div style={{ fontWeight: 700, color: 'var(--text-mid)', fontSize: 14 }}>
                No open cases
              </div>
              <div style={{ fontSize: 11, marginTop: 6 }}>
                {inspector.name} has full capacity for new assignments.
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {cases.length} case{cases.length === 1 ? '' : 's'} · overdue first
                </div>
                {inspector.openCases >= 3 && (
                  <button
                    type="button"
                    onClick={onBulkReassign}
                    style={{
                      padding: '5px 12px',
                      background: 'var(--ai-gradient)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 10.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ✦ Bulk reassign
                  </button>
                )}
              </div>

              {cases.map((c, idx) => (
                <div
                  key={`${idx}-${c.id}`}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderLeft: `3px solid ${c.isOverdue ? 'var(--red)' : 'var(--border)'}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 6,
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--mono)',
                            fontSize: 10.5,
                            color: 'var(--id-text)',
                            fontWeight: 700,
                          }}
                        >
                          {c.id}
                        </span>
                        {c.isOverdue && (
                          <span
                            style={{
                              padding: '1px 6px',
                              background: 'rgba(220,53,69,.12)',
                              color: 'var(--red)',
                              borderRadius: 8,
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            PAST SLA
                          </span>
                        )}
                        <div
                          className={riskClass(c.risk)}
                          style={{ width: 20, height: 20, fontSize: 9 }}
                        >
                          {c.risk}
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>
                        {c.consumer}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 1 }}>
                        {c.theftType} · {c.area} · meter #{c.meter}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 9.5,
                          color: 'var(--text-dim)',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Due
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: c.isOverdue ? 'var(--red)' : 'var(--text)',
                        }}
                      >
                        {c.due}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => openCaseDetail(c.id)}
                      style={{
                        flex: 1,
                        padding: '5px 10px',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 5,
                        fontSize: 10.5,
                        cursor: 'pointer',
                        color: 'var(--text-mid)',
                        fontWeight: 600,
                      }}
                    >
                      View case
                    </button>
                    <button
                      type="button"
                      onClick={() => onReassign(c)}
                      style={{
                        flex: 1,
                        padding: '5px 10px',
                        background: 'var(--ai-gradient)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Reassign →
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
