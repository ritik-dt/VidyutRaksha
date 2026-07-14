import type { ReportId, ReportTemplate } from '../types'

interface TemplatesListProps {
  templates: ReportTemplate[]
  onOpen: (id: ReportId) => void
}

/** Section D · templates library. Whole row is clickable. */
export function TemplatesList({ templates, onOpen }: TemplatesListProps) {
  return (
    <div className="card rep-list-card">
      {templates.map((t) => (
        <div
          key={t.id}
          className="rep-tmpl-row"
          onClick={() => onOpen(t.id)}
          role="button"
          tabIndex={0}
        >
          <div className="rep-tmpl-body">
            <div className="rep-tmpl-name">{t.name}</div>
            <div className="rep-tmpl-meta">
              {t.uses} uses · last {t.lastUsed}
            </div>
          </div>
          <div className="rep-tmpl-arrow">→</div>
        </div>
      ))}
    </div>
  )
}
