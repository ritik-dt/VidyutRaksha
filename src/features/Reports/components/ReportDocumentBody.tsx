import type { ReportBlock, ReportSection } from '../types'

// ── Tone helpers (was .rep-tone-* / .rep-doc-mtile.rep-tone-* / .rep-doc-barfill.rep-tone-*) ──

function metricTileStyles(tone?: string): { bg: string; border: string; color: string } {
  switch (tone) {
    case 'red':    return { bg: 'rgba(220,53,69,0.06)',  border: 'rgba(220,53,69,0.22)',  color: 'var(--red)' }
    case 'green':  return { bg: 'rgba(40,167,69,0.06)',  border: 'rgba(40,167,69,0.22)',  color: 'var(--green)' }
    case 'purple': return { bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.22)', color: 'var(--ai-purple)' }
    case 'teal':   return { bg: 'rgba(23,162,184,0.06)', border: 'rgba(23,162,184,0.22)', color: 'var(--teal)' }
    case 'amber':  return { bg: 'rgba(230,146,30,0.06)', border: 'rgba(230,146,30,0.22)', color: 'var(--amber)' }
    default:       return { bg: 'var(--bg)',              border: 'var(--border)',         color: 'var(--text)' }
  }
}

function barFillColor(tone?: string): string {
  switch (tone) {
    case 'red':    return 'var(--red)'
    case 'amber':  return 'var(--amber)'
    case 'green':  return 'var(--green)'
    case 'purple': return 'var(--ai-purple)'
    case 'teal':   return 'var(--teal)'
    default:       return 'var(--text-mid)'
  }
}

/**
 * Row-tone helpers for tables. `variant` sets the tinted background; `strongTop`
 * makes the divider above thicker (used for footer/total rows).
 */
function rowStyles(variant?: string, strongTop?: boolean): React.CSSProperties {
  const base: React.CSSProperties = {}
  switch (variant) {
    case 'purple':
      base.background = 'rgba(124,58,237,0.05)'
      base.fontWeight = strongTop ? 800 : 700
      base.borderTop = '1px solid var(--border)'
      break
    case 'red':
      base.background = 'rgba(220,53,69,0.04)'
      base.fontWeight = strongTop ? 800 : 700
      if (strongTop) {
        base.borderTopWidth = '2px'
        base.borderTopColor = 'var(--red)'
        base.color = 'var(--red)'
      }
      break
    case 'green':
      base.background = 'rgba(40,167,69,0.05)'
      base.fontWeight = 700
      base.borderTop = '1px solid var(--border)'
      break
  }
  if (strongTop && variant !== 'red') {
    base.borderTopWidth = '2px'
  }
  return base
}

/** Renders one typed block. The typed block model replaces the prototype's raw
 *  HTML strings — paragraphs/notes still allow inline <strong>/<em>. */
function Block({ block }: { block: ReportBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return (
        <p
          className="mb-[8px] mt-0 leading-[1.55] [&_strong]:text-[var(--text)]"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )

    case 'list':
      return (
        <ul className="mb-[8px] mt-[6px] ml-[22px] leading-[1.6] text-[var(--text)] list-disc [&_li]:mb-[3px]">
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      )

    case 'caption':
      return (
        <p
          className="mt-[8px] mb-0 text-[10.5px] text-[var(--text-mid)] leading-[1.5] [&_strong]:text-[var(--ai-purple)]"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )

    case 'table':
      return (
        <div className="overflow-x-auto max-[480px]:-mx-[8px] max-[480px]:px-[8px]">
          <table
            className={
              'w-full border-collapse text-[11px] min-w-[460px] max-[480px]:min-w-[380px] ' +
              "[&_thead_tr]:bg-[var(--bg)] [&_thead_tr]:border-b [&_thead_tr]:border-b-[var(--border)] " +
              "[&_th]:py-[6px] [&_th]:px-[9px] [&_th]:text-left [&_th]:text-[var(--text-dim)] [&_th]:font-semibold [&_th]:text-[9.5px] [&_th]:uppercase " +
              "[&_tbody_tr]:border-b [&_tbody_tr]:border-b-[var(--border-light)] " +
              "[&_tbody_tr:last-child]:border-b-0 " +
              "[&_td]:py-[7px] [&_td]:px-[9px]"
            }
          >
            <thead>
              <tr>
                {block.cols.map((c, i) => (
                  <th key={i} className={c.align === 'right' ? '!text-right' : undefined}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={rowStyles(row.variant, row.strongTop)}>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={[
                        cell.align === 'right' ? '!text-right' : '',
                        cell.mono ? "font-['JetBrains_Mono',_ui-monospace,_monospace]" : '',
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
                        <span className="inline-flex items-center gap-[6px]">
                          <span className="w-[60px] h-[5px] bg-[var(--bg)] rounded-[3px] overflow-hidden shrink-0 inline-block">
                            <span
                              className="block h-full max-w-full"
                              style={{
                                width: `${cell.bar.percent}%`,
                                background: barFillColor(cell.bar.tone),
                              }}
                            />
                          </span>
                          <strong className="font-['JetBrains_Mono',_ui-monospace,_monospace] w-[30px] text-right inline-block">
                            {cell.text}
                          </strong>
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

    case 'metricGrid': {
      const colsClass =
        block.cols === 4
          ? 'grid-cols-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1'
          : 'grid-cols-3 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1'
      return (
        <div className={`grid gap-[10px] mb-[12px] ${colsClass}`}>
          {block.tiles.map((t, i) => {
            const s = metricTileStyles(t.tone)
            return (
              <div
                key={i}
                className="py-[11px] px-[11px] rounded-[7px] border min-w-0"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <div className="text-[9.5px] text-[var(--text-dim)] font-bold tracking-[0.3px] uppercase break-words">
                  {t.label}
                </div>
                <div className="flex items-baseline gap-[4px] mt-[2px]">
                  <div
                    className="text-[22px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] leading-[1.1] break-words max-[480px]:text-[20px]"
                    style={{ color: s.color }}
                  >
                    {t.value}
                  </div>
                  {t.unit && (
                    <div className="text-[10px] text-[var(--text-mid)] break-words">{t.unit}</div>
                  )}
                </div>
                {t.sub && (
                  <div className="text-[9.5px] text-[var(--text-mid)] mt-[2px] break-words">
                    {t.sub}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    }
  }
}

interface ReportDocumentBodyProps {
  sections: ReportSection[]
}

/** The stacked list of report sections rendered inside the full-modal body. */
export function ReportDocumentBody({ sections }: ReportDocumentBodyProps) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i} className="mb-[22px]">
          <div className="text-[13px] font-bold text-[var(--text)] uppercase tracking-[0.4px] mb-[10px] pb-[6px] border-b border-b-[var(--border-light)] max-[480px]:text-[12px]">
            {s.heading}
          </div>
          <div className="text-[11.5px] text-[var(--text)] leading-[1.55] max-[480px]:text-[11px]">
            {s.blocks.map((b, bi) => (
              <Block key={bi} block={b} />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
