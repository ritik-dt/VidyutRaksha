import { NOTICE_TEMPLATES } from '../data/notices'
import type { NoticeTemplate } from '../types'

interface NoticeTemplatesCardProps {
  onSelect: (template: NoticeTemplate) => void
}

/** Right card in grid-2 — 8 notice-template cards. */
export function NoticeTemplatesCard({ onSelect }: NoticeTemplatesCardProps) {
  return (
    <div className="card">
      <div className="card-title">Notice templates</div>
      <div className="flex flex-col gap-2">
        {NOTICE_TEMPLATES.map((t) => (
          <div
            key={t.name}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(t)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(t)
              }
            }}
            className="cursor-pointer rounded-md p-2.5 transition-transform duration-150 hover:translate-x-0.5"
            style={{
              background: 'var(--bg)',
              borderLeft: `3px solid ${t.color}`,
            }}
          >
            <div className="flex items-center justify-between gap-2 max-sm:flex-wrap">
              <div className="min-w-0 flex-1 text-[12px] font-semibold break-words">{t.name}</div>
              <span
                className="shrink-0 rounded-[10px] px-2 py-[3px] text-[9px] font-semibold"
                style={{
                  background: 'rgba(40,167,69,0.10)',
                  color: 'var(--green)',
                  border: '1px solid rgba(40,167,69,0.35)',
                }}
              >
                {t.language}
              </span>
            </div>
            <div className="mt-0.5 text-[10px] text-text-mid">{t.description}</div>
            <div className="mt-0.5 text-[10px] text-text-dim">
              Used {t.usageCount} times
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
