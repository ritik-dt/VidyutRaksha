import { FEATURED_CASE_ID, NOTICE_SAMPLE } from '../data/notices'
import type { NoticeLanguage } from '../types'

interface NoticePreviewCardProps {
  language: NoticeLanguage
  onLanguageChange: (lang: NoticeLanguage) => void
  onAttachEvidence: () => void
  onEdit: () => void
  onExportPdf: () => void
  onEmail: () => void
  onSend: () => void
}

/** Left card in grid-2 — full notice preview with language toggle + actions. */
export function NoticePreviewCard({
  language,
  onLanguageChange,
  onAttachEvidence,
  onEdit,
  onExportPdf,
  onEmail,
  onSend,
}: NoticePreviewCardProps) {
  return (
    <div className="card">
      <div className="card-title">Notice preview — Case {FEATURED_CASE_ID}</div>

      {/* language toggle + attach evidence */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={
            language === 'en'
              ? 'btn btn-ai btn-sm'
              : 'btn btn-outline btn-sm'
          }
          style={{ fontSize: 10 }}
        >
          🇬🇧 English
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('hi')}
          className={
            language === 'hi'
              ? 'btn btn-ai btn-sm'
              : 'btn btn-outline btn-sm'
          }
          style={{ fontSize: 10 }}
        >
          🇮🇳 हिंदी
        </button>
        <button
          type="button"
          onClick={onAttachEvidence}
          className="btn btn-outline btn-sm"
          style={{ fontSize: 10 }}
        >
          📎 Attach evidence
        </button>
      </div>

      {/* full-text draft — matches prototype's inline style exactly:
          max-height 500px, overflow-y auto, white-space pre-wrap.
          `min-w-0 max-w-full` prevent the pre's intrinsic content width from
          pushing the grid column wider than the viewport on narrow screens. */}
      <pre
        className="whitespace-pre-wrap font-mono text-[10px] leading-[1.6] text-text min-w-0 max-w-full"
        style={{
          background: 'var(--bg)',
          padding: 14,
          borderRadius: 8,
          maxHeight: 500,
          overflowY: 'auto',
          overflowX: 'auto',
          border: '1px solid var(--border)',
          margin: 0,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        {NOTICE_SAMPLE}
      </pre>

      {/* action buttons — prototype's margin-top:12px, justify-content:flex-end */}
      <div className="mt-3 flex flex-wrap justify-end gap-1.5 max-sm:justify-stretch">
        <button
          type="button"
          className="btn btn-outline btn-sm max-sm:flex-1"
          onClick={onEdit}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm max-sm:flex-1"
          onClick={onExportPdf}
        >
          📄 Export PDF
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm max-sm:flex-1"
          onClick={onEmail}
        >
          📧 Email
        </button>
        <button type="button" className="btn btn-ai btn-sm max-sm:w-full" onClick={onSend}>
          ✦ Send via SMS + Post
        </button>
      </div>
    </div>
  )
}
