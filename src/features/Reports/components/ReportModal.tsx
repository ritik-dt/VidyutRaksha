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
 * Report viewer overlay. Two variants:
 *   • full  — regulatory document (920px max, 92vh scroll)
 *   • stub  — auto-generation preview (680px max, 88vh)
 *
 * Both use a translucent blurred backdrop. Modal is fully responsive:
 *   • Desktop: capped width, centered
 *   • Mobile:  fills the viewport with 12px padding.
 */
export function ReportModal({ resolved, onClose, onExportPdf, onGenerate }: ReportModalProps) {
  if (!resolved || resolved.kind === 'missing') return null

  const isFull = resolved.kind === 'full'

  return (
    <div
      className="fixed inset-0 bg-[rgba(11,18,32,0.72)] [backdrop-filter:blur(5px)] z-[9999] flex items-center justify-center p-[24px] max-[640px]:p-[16px] max-[480px]:p-[12px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={
          'bg-[var(--card)] border border-[var(--border)] rounded-[14px] w-full overflow-y-auto shadow-[0_30px_70px_rgba(0,0,0,0.5)] ' +
          (isFull
            ? 'max-w-[920px] max-h-[92vh]'
            : 'max-w-[680px] max-h-[88vh]')
        }
        role="dialog"
        aria-modal="true"
      >
        {resolved.kind === 'full' ? (
          <>
            {/* Header — sticky, gradient background, purple-tinted */}
            <div className="py-[18px] px-[26px] border-b border-b-[var(--border)] flex justify-between items-start gap-[12px] rounded-[14px_14px_0_0] sticky top-0 z-10 bg-[linear-gradient(135deg,_rgba(124,58,237,0.05)_0%,_rgba(124,58,237,0.01)_100%)] max-[640px]:py-[15px] max-[640px]:px-[18px] max-[480px]:py-[13px] max-[480px]:px-[14px]">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[var(--ai-purple)] font-bold tracking-[0.6px] uppercase mb-[2px] max-[480px]:text-[9.5px]">
                  📄 Report · {resolved.def.regulator}
                </div>
                <div className="text-[16px] font-bold text-[var(--text)] break-words max-[640px]:text-[15px] max-[480px]:text-[14px]">
                  {resolved.def.title}
                </div>
                <div className="text-[11px] text-[var(--text-mid)] mt-[1px] break-words max-[480px]:text-[10.5px]">
                  {resolved.def.subtitle}
                </div>
              </div>
              <button
                type="button"
                className="bg-[var(--bg)] border border-[var(--border)] w-[32px] h-[32px] rounded-full cursor-pointer text-[15px] text-[var(--text-mid)] shrink-0 flex items-center justify-center hover:bg-[var(--bg-soft)] max-[480px]:w-[28px] max-[480px]:h-[28px] max-[480px]:text-[13px]"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="py-[22px] px-[28px] max-[640px]:py-[18px] max-[640px]:px-[20px] max-[480px]:py-[15px] max-[480px]:px-[14px]">
              {/* Doc meta */}
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[8px] py-[12px] px-[14px] mb-[18px] text-[11px] text-[var(--text-mid)] leading-[1.6] [&_strong]:text-[var(--text)] max-[480px]:py-[10px] max-[480px]:px-[12px] max-[480px]:text-[10.5px]">
                <div className="grid grid-cols-2 gap-[6px] max-[480px]:grid-cols-1">
                  <div>
                    <strong>Document №:</strong>{' '}
                    <span className="font-['JetBrains_Mono',_ui-monospace,_monospace] break-all">{resolved.def.docNo}</span>
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

              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[8px] py-[11px] px-[14px] mb-[18px] text-[10.5px] text-[var(--text-mid)] leading-[1.55] italic max-[480px]:py-[9px] max-[480px]:px-[12px] max-[480px]:text-[10px]">
                {resolved.def.footer}
              </div>

              <div className="flex gap-[8px] justify-end flex-wrap max-[480px]:justify-stretch">
                <button
                  type="button"
                  className="py-[8px] px-[16px] bg-[var(--card)] text-[var(--text-mid)] border border-[var(--border)] rounded-[8px] text-[11.5px] font-semibold cursor-pointer hover:bg-[var(--bg-soft)] max-[480px]:flex-1 max-[480px]:min-w-0"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="py-[8px] px-[16px] [background:var(--ai-gradient)] text-white border-none rounded-[8px] text-[11.5px] font-bold cursor-pointer whitespace-nowrap hover:[filter:brightness(1.05)] max-[480px]:flex-1 max-[480px]:min-w-0 max-[480px]:whitespace-normal"
                  onClick={onExportPdf}
                >
                  ⬇ Export signed PDF
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* STUB variant header — teal-tinted, not sticky (short content) */}
            <div className="py-[18px] px-[24px] border-b border-b-[var(--border)] flex justify-between items-start gap-[12px] rounded-[14px_14px_0_0] bg-[linear-gradient(135deg,_rgba(23,162,184,0.05)_0%,_rgba(23,162,184,0.01)_100%)] max-[640px]:py-[15px] max-[640px]:px-[18px] max-[480px]:py-[13px] max-[480px]:px-[14px]">
              <div className="min-w-0 flex-1">
                <div className="text-[9.5px] text-[var(--teal)] font-bold tracking-[0.6px] uppercase mb-[2px]">
                  📄 Report preview
                </div>
                <div className="text-[15px] font-bold text-[var(--text)] break-words max-[640px]:text-[14px] max-[480px]:text-[13.5px]">
                  {resolved.stub.title}
                </div>
                <div className="text-[11px] text-[var(--text-mid)] mt-[1px] break-words max-[480px]:text-[10.5px]">
                  {resolved.stub.subtitle}
                </div>
              </div>
              <button
                type="button"
                className="bg-[var(--bg)] border border-[var(--border)] w-[32px] h-[32px] rounded-full cursor-pointer text-[15px] text-[var(--text-mid)] shrink-0 flex items-center justify-center hover:bg-[var(--bg-soft)] max-[480px]:w-[28px] max-[480px]:h-[28px] max-[480px]:text-[13px]"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="py-[22px] px-[26px] max-[640px]:py-[18px] max-[640px]:px-[20px] max-[480px]:py-[15px] max-[480px]:px-[14px]">
              <div className="text-[12px] font-bold text-[var(--text)] mb-[10px] uppercase tracking-[0.4px] max-[480px]:text-[11.5px]">
                Report structure · {resolved.stub.sectionTitles.length} sections
              </div>
              <div className="grid grid-cols-1 gap-[7px] mb-[16px]">
                {resolved.stub.sectionTitles.map((t, i) => (
                  <div
                    key={i}
                    className="flex gap-[11px] py-[10px] px-[12px] bg-[var(--bg)] rounded-[7px] border-l-[3px] border-l-[var(--teal)] items-center min-w-0"
                  >
                    <div className="w-[22px] h-[22px] rounded-full bg-[var(--teal)] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="text-[11.5px] font-semibold text-[var(--text)] flex-1 break-words max-[480px]:text-[11px]">{t}</div>
                  </div>
                ))}
              </div>

              <div className="bg-[rgba(40,167,69,0.06)] border border-[rgba(40,167,69,0.22)] rounded-[8px] py-[10px] px-[13px] mb-[14px] text-[10.5px] text-[var(--text-mid)] leading-[1.55] [&_strong]:text-[var(--green)] max-[480px]:text-[10px]">
                <strong>✓ Auto-generation ready</strong> — Click "Generate now" to compose this
                report from live data sources and route to configured recipients.
              </div>

              <div className="flex gap-[8px] justify-end flex-wrap max-[480px]:justify-stretch">
                <button
                  type="button"
                  className="py-[8px] px-[16px] bg-[var(--card)] text-[var(--text-mid)] border border-[var(--border)] rounded-[8px] text-[11.5px] font-semibold cursor-pointer hover:bg-[var(--bg-soft)] max-[480px]:flex-1 max-[480px]:min-w-0"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="py-[8px] px-[16px] [background:var(--ai-gradient)] text-white border-none rounded-[8px] text-[11.5px] font-bold cursor-pointer whitespace-nowrap hover:[filter:brightness(1.05)] max-[480px]:flex-1 max-[480px]:min-w-0"
                  onClick={onGenerate}
                >
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
