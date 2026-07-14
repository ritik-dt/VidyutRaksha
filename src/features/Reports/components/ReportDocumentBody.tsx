import type { ReportBlock, ReportSection } from '../types'

/** Renders one typed block. The block model is what replaces the prototype's
 *  raw HTML strings — paragraphs/notes keep only inline <strong>/<em>. */
function Block({ block }: { block: ReportBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="rep-doc-p" dangerouslySetInnerHTML={{ __html: block.html }} />

    case 'list':
      return (
        <ul className="rep-doc-ul">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      )

    case 'caption':
      return <p className="rep-doc-caption" dangerouslySetInnerHTML={{ __html: block.html }} />

    case 'table':
      return (
        <div className="rep-doc-table-wrap">
          <table className="rep-doc-table">
            <thead>
              <tr>
                {block.cols.map((c, i) => (
                  <th key={i} className={c.align === 'right' ? 'rep-r' : undefined}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={[
                    row.variant ? `rep-row-${row.variant}` : '',
                    row.strongTop ? 'rep-row-strongtop' : '',
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined}
                >
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={[
                        cell.align === 'right' ? 'rep-r' : '',
                        cell.mono ? 'rep-mono' : '',
                      ]
                        .filter(Boolean)
                        .join(' ') || undefined}
                      style={{
                        ...(cell.color ? { color: cell.color } : {}),
                        ...(cell.bold ? { fontWeight: 700 } : {}),
                        ...(cell.width ? { width: cell.width } : {}),
                        ...(cell.fontSize ? { fontSize: cell.fontSize } : {}),
                      }}
                    >
                      {cell.bar ? (
                        <span className="rep-doc-barwrap">
                          <span className="rep-doc-bartrack">
                            <span
                              className={`rep-doc-barfill rep-tone-${cell.bar.tone}`}
                              style={{ width: `${cell.bar.percent}%` }}
                            />
                          </span>
                          <strong className="rep-doc-barval">{cell.text}</strong>
                        </span>
                      ) : (
                        cell.text
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'metricGrid':
      return (
        <div className={`rep-doc-mgrid rep-doc-mgrid-${block.cols}`}>
          {block.tiles.map((t, i) => (
            <div
              key={i}
              className={`rep-doc-mtile${t.tone ? ` rep-tone-${t.tone}` : ''}`}
            >
              <div className="rep-doc-mlabel">{t.label}</div>
              <div className="rep-doc-mrow">
                <div className="rep-doc-mvalue">{t.value}</div>
                {t.unit && <div className="rep-doc-munit">{t.unit}</div>}
              </div>
              {t.sub && <div className="rep-doc-msub">{t.sub}</div>}
            </div>
          ))}
        </div>
      )
  }
}

interface ReportDocumentBodyProps {
  sections: ReportSection[]
}

export function ReportDocumentBody({ sections }: ReportDocumentBodyProps) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i} className="rep-doc-sec">
          <div className="rep-doc-sec-h">{s.heading}</div>
          <div className="rep-doc-body">
            {s.blocks.map((b, bi) => (
              <Block key={bi} block={b} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
