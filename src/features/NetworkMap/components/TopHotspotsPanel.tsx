import { useNavigate } from 'react-router-dom'
import { useScope } from '@/shared/context/ScopeContext'
import { formatIndian } from '@/shared/utils/formatters'
import type { EnrichedFeeder } from '../types'

interface TopHotspotsPanelProps {
  hotspots: EnrichedFeeder[]
}

/**
 * Right-column card listing the top-6 theft-hotspot feeders + 2 action buttons.
 * Each row is clickable — matches prototype behaviour (drill scope then jump to cases).
 */
export function TopHotspotsPanel({ hotspots }: TopHotspotsPanelProps) {
  const scope = useScope()
  const navigate = useNavigate()

  const openFeederCases = (id: string) => {
    scope.drillToChild(id)
    setTimeout(() => navigate('/cases'), 80)
  }

  const rowColor = (loss: number) =>
    loss >= 25 ? 'var(--red)' : loss >= 22 ? 'var(--amber)' : 'var(--green)'

  return (
    <div
      className="card"
      style={{ margin: 0, padding: 14, display: 'flex', flexDirection: 'column', maxHeight: 580 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>
          Top theft-hotspot feeders
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>click → cases</div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 2 }}>
        {hotspots.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '30px 0',
              color: 'var(--text-dim)',
              fontSize: 11,
            }}
          >
            No feeders at this scope.
            <br />
            Drill into a sub-division to see details.
          </div>
        ) : (
          hotspots.map((f) => {
            const c = rowColor(f.loss || 0)
            return (
              <div
                key={f.id}
                onClick={() => openFeederCases(f.id)}
                className="clickable"
                style={{
                  padding: '9px 11px',
                  background: 'var(--bg)',
                  borderRadius: 7,
                  borderLeft: `3px solid ${c}`,
                  marginBottom: 6,
                  transition: 'transform 0.12s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {f.name}
                    {f._synthetic && (
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 700,
                          padding: '1px 5px',
                          background: 'rgba(251,191,36,0.18)',
                          color: 'var(--amber)',
                          borderRadius: 3,
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase',
                        }}
                      >
                        demo
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: c,
                    }}
                  >
                    {(f.loss || 0).toFixed(1)}%
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: 10,
                    color: 'var(--text-mid)',
                  }}
                >
                  <span>{f.dtCount} DTs</span>
                  <span>·</span>
                  <span>{formatIndian(f.consumers)} consumers</span>
                  <span>·</span>
                  <span style={{ color: 'var(--red)', fontWeight: 600 }}>
                    {formatIndian(f.flagged)} flagged
                  </span>
                  <span>·</span>
                  <span style={{ color: 'var(--ai-purple)' }}>View →</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 6,
        }}
      >
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ flex: 1, fontSize: 11 }}
          onClick={() => navigate('/cases')}
        >
          📋 All cases
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ flex: 1, fontSize: 11 }}
          onClick={() => navigate('/clusters')}
        >
          🎯 Coordinated
        </button>
      </div>
    </div>
  )
}
