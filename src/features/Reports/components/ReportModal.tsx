import { ReportDocumentBody } from './ReportDocumentBody'
import type { ResolvedReport } from '../types'

interface ReportModalProps {
  resolved: ResolvedReport | null
  onClose: () => void
  onExportPdf: () => void
  onGenerate: () => void
}

/** Today's date in the prototype's en-IN format. */
function today(): string {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Report viewer overlay. Two variants, matching the prototype's
 * _renderFullReport (regulatory document) and _renderStubReport (preview).
 *
 * Kept local to Reports for now — the first consumer. Promote to shared/ when a
 * second module needs a modal shell (Users #24 will need one for deletes).
 */
export function ReportModal({ resolved, onClose, onExportPdf, onGenerate }: ReportModalProps) {
  if (!resolved || resolved.kind === 'missing') return null

  const isFull = resolved.kind === 'full'

  return (
    <div
      className="rep-modal-mask"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`rep-modal ${isFull ? 'rep-modal-full' : 'rep-modal-stub'}`}
        role="dialog"
        aria-modal="true"
      >
        {resolved.kind === 'full' ? (
          <>
            <div className="rep-modal-head">
              <div>
                <div className="rep-modal-eyebrow">📄 Report · {resolved.def.regulator}</div>
                <div className="rep-modal-title">{resolved.def.title}</div>
                <div className="rep-modal-sub">{resolved.def.subtitle}</div>
              </div>
              <button
                type="button"
                className="rep-modal-x"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="rep-modal-body">
              <div className="rep-doc-meta">
                <div className="rep-doc-meta-grid">
                  <div>
                    <strong>Document №:</strong>{' '}
                    <span className="rep-mono">{resolved.def.docNo}</span>
                  </div>
                  <div>
                    <strong>Date:</strong> {today()}
                  </div>
                  <div>
                    <strong>Classification:</strong> {resolved.def.classification}
                  </div>
                  <div>
                    <strong>Cite:</strong> {resolved.def.legalCite}
                  </div>
                </div>
              </div>

              <ReportDocumentBody sections={resolved.def.sections} />

              <div className="rep-doc-footer">{resolved.def.footer}</div>

              <div className="rep-modal-actions">
                <button type="button" className="rep-modal-close-btn" onClick={onClose}>
                  Close
                </button>
                <button type="button" className="rep-modal-cta" onClick={onExportPdf}>
                  ⬇ Export signed PDF
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rep-modal-head">
              <div>
                <div className="rep-modal-eyebrow">📄 Report preview</div>
                <div className="rep-modal-title">{resolved.stub.title}</div>
                <div className="rep-modal-sub">{resolved.stub.subtitle}</div>
              </div>
              <button
                type="button"
                className="rep-modal-x"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="rep-modal-body">
              <div className="rep-stub-h">
                Report structure · {resolved.stub.sectionTitles.length} sections
              </div>
              <div className="rep-stub-list">
                {resolved.stub.sectionTitles.map((t, i) => (
                  <div key={i} className="rep-stub-item">
                    <div className="rep-stub-n">{i + 1}</div>
                    <div className="rep-stub-t">{t}</div>
                  </div>
                ))}
              </div>

              <div className="rep-stub-ready">
                <strong>✓ Auto-generation ready</strong> — Click "Generate now" to compose this
                report from live data sources and route to configured recipients.
              </div>

              <div className="rep-modal-actions">
                <button type="button" className="rep-modal-close-btn" onClick={onClose}>
                  Close
                </button>
                <button type="button" className="rep-modal-cta" onClick={onGenerate}>
                  Generate now
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
