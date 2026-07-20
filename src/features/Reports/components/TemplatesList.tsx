import type { ReportId, ReportTemplate } from '../types'

interface TemplatesListProps {
  templates: ReportTemplate[]
  onOpen: (id: ReportId) => void
}

/** Section D · templates library. Whole row is clickable. */
export function TemplatesList({ templates, onOpen }: TemplatesListProps) {
  return (
    <div className="card !p-0 overflow-hidden">
      {templates.map((t, idx) => (
        <div
          key={t.id}
          className={
            'flex justify-between py-[11px] px-[14px] items-center cursor-pointer transition-[background_0.15s] gap-[10px] hover:bg-[var(--bg-soft)] max-[480px]:py-[10px] max-[480px]:px-[12px]' +
            (idx > 0 ? ' border-t border-t-[var(--border-light)]' : '')
          }
          onClick={() => onOpen(t.id)}
          role="button"
          tabIndex={0}
        >
          <div className="min-w-0 flex-1">
            <div className="text-[11.5px] font-semibold text-[var(--text)] leading-[1.3] break-words max-[480px]:text-[11px]">
              {t.name}
            </div>
            <div className="text-[9.5px] text-[var(--text-dim)] mt-[1px]">
              {t.uses} uses · last {t.lastUsed}
            </div>
          </div>
          <div className="text-[14px] text-[var(--ai-purple)] shrink-0">→</div>
        </div>
      ))}
    </div>
  )
}
