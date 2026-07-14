import { textToneClass } from '../logic/tone'
import type { DetailPanelData } from '../types'

interface DetailSidePanelProps {
  isOpen: boolean
  panel: DetailPanelData | null
  onClose: () => void
  onToast: (msg: string) => void
}

export function DetailSidePanel({ isOpen, panel, onClose, onToast }: DetailSidePanelProps) {
  return (
    <>
      <div
        className={`exec-detail-mask${isOpen ? ' exec-open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`exec-detail-panel${isOpen ? ' exec-open' : ''}`}
        role="dialog"
        aria-label={panel?.title ?? 'Detail'}
        aria-hidden={!isOpen}
      >
        {panel && (
          <>
            <div className="exec-detail-head">
              <div>
                <div className="exec-detail-sub">{panel.sub}</div>
                <div className="exec-detail-title">{panel.title}</div>
              </div>
              <button
                type="button"
                className="exec-detail-close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="exec-detail-body">
              {panel.summary.length > 0 && (
                <div className="exec-detail-summary">
                  {panel.summary.map((s, i) => (
                    <div key={i} className="exec-detail-summary-item">
                      <div className={`exec-detail-summary-val ${textToneClass(s.tone)}`}>{s.value}</div>
                      <div className="exec-detail-summary-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {panel.sections.map((sec, i) => (
                <div key={i}>
                  {sec.header && <div className="exec-detail-sec">{sec.header}</div>}
                  {sec.table && (
                    <div className="exec-detail-table-wrap">
                      <table className="exec-detail-table">
                        <thead>
                          <tr>{sec.table.headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, ri) => (
                            <tr key={ri}>
                              {row.cells.map((c, ci) => {
                                const cls = textToneClass(c.tone)
                                const inner = c.bold ? <strong>{c.text}</strong> : c.text
                                return (
                                  <td key={ci} className={cls || undefined}>
                                    {inner}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {panel.actions.length > 0 && (
                <div className="exec-detail-actions">
                  {panel.actions.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`exec-detail-btn exec-detail-btn-${a.variant}`}
                      onClick={() => onToast(a.toastMessage)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {panel.note && (
                <div
                  className="exec-detail-note"
                  dangerouslySetInnerHTML={{ __html: panel.note }}
                />
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
