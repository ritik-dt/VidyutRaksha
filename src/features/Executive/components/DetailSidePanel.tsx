import type { DetailPanelData } from '../types'

interface DetailSidePanelProps {
  isOpen: boolean
  panel: DetailPanelData | null
  onClose: () => void
  onToast: (msg: string) => void
}

function toneColor(tone?: string): string {
  switch (tone) {
    case 'jade':    return 'var(--exec-jade)'
    case 'amber':   return 'var(--exec-amber)'
    case 'crimson': return 'var(--exec-crimson)'
    case 'brand':   return 'var(--exec-brand)'
    default:        return 'var(--exec-ink)'
  }
}

/**
 * Detail side-panel — slides in from right (560px, max 92vw) when a KPI/alert/
 * metric is clicked. Faithful to the prototype's .chm-panel slide-out.
 */
export function DetailSidePanel({ isOpen, panel, onClose, onToast }: DetailSidePanelProps) {
  return (
    <>
      {/* Backdrop mask */}
      <div
        className={`fixed inset-0 bg-[rgba(28,31,46,0.4)] transition-[opacity_0.2s] z-[99998] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden
      />
      {/* Sliding panel — 560px desktop, full-width mobile */}
      <aside
        className={`fixed top-0 right-0 h-[100vh] w-[560px] max-w-[92vw] bg-[var(--exec-surface)] border-l border-l-[var(--exec-border)] shadow-[-12px_0_40px_rgba(28,31,46,0.18)] transition-[transform_0.28s_cubic-bezier(0.23,1,0.32,1)] z-[99999] flex flex-col max-[640px]:!max-w-full max-[640px]:!w-full ${
          isOpen ? '[transform:translateX(0)]' : '[transform:translateX(100%)]'
        }`}
        role="dialog"
        aria-label={panel?.title ?? 'Detail'}
        aria-hidden={!isOpen}
      >
        {panel && (
          <>
            {/* Header — gradient background */}
            <div className="py-[18px] px-[24px] border-b border-b-[var(--exec-border)] flex items-start justify-between gap-[12px] bg-[linear-gradient(135deg,_var(--exec-brand-light),_var(--exec-surface2))] max-[640px]:py-[14px] max-[640px]:px-[18px] max-[480px]:py-[12px] max-[480px]:px-[14px]">
              <div className="min-w-0 flex-1">
                <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9.5px] tracking-[0.18em] uppercase text-[var(--exec-brand)] mb-[4px] max-[480px]:text-[9px]">{panel.sub}</div>
                <div className="font-['Syne',_serif] text-[20px] font-bold text-[var(--exec-ink)] tracking-[-0.01em] leading-[1.2] break-words max-[640px]:text-[17px] max-[480px]:text-[15px]">{panel.title}</div>
              </div>
              <button
                type="button"
                className="bg-transparent border border-[var(--exec-border2)] rounded-[8px] w-[32px] h-[32px] text-[20px] leading-none cursor-pointer text-[var(--exec-ink3)] shrink-0 flex items-center justify-center transition-[all_0.15s] hover:bg-[var(--exec-crimson-bg)] hover:text-[var(--exec-crimson)] hover:border-[var(--exec-crimson-border)] max-[480px]:w-[28px] max-[480px]:h-[28px] max-[480px]:text-[18px]"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto pt-[18px] px-[24px] pb-[32px] max-[640px]:pt-[14px] max-[640px]:px-[18px] max-[640px]:pb-[24px] max-[480px]:pt-[12px] max-[480px]:px-[14px] max-[480px]:pb-[20px]">
              {/* Summary tiles — responsive: 3-col → 2-col → 1-col */}
              {panel.summary.length > 0 && (
                <div className="grid grid-cols-3 gap-[8px] mb-[16px] max-[640px]:grid-cols-2 max-[640px]:gap-[6px] max-[480px]:grid-cols-1 max-[480px]:mb-[12px]">
                  {panel.summary.map((s, i) => (
                    <div key={i} className="py-[11px] px-[13px] border border-[var(--exec-border)] rounded-[9px] bg-[var(--exec-surface2)] min-w-0 max-[640px]:py-[9px] max-[640px]:px-[11px] max-[480px]:py-[8px] max-[480px]:px-[10px]">
                      <div
                        className="font-['Syne',_serif] text-[20px] font-bold leading-[1.1] tracking-[-0.01em] break-words max-[640px]:text-[16px] max-[480px]:text-[15px]"
                        style={{ color: toneColor(s.tone) }}
                      >
                        {s.value}
                      </div>
                      <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[8.5px] tracking-[0.08em] uppercase text-[var(--exec-ink4)] mt-[4px] break-words">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {panel.sections.map((sec, i) => (
                <div key={i}>
                  {sec.header && (
                    <div className="font-['JetBrains_Mono',_ui-monospace,_monospace] text-[9px] tracking-[0.2em] uppercase text-[var(--exec-ink4)] mt-[14px] mb-[8px] flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-px after:bg-[var(--exec-border)]">
                      {sec.header}
                    </div>
                  )}
                  {sec.table && (
                    <div className="overflow-x-auto -mx-[8px] px-[8px] max-[480px]:mx-0 max-[480px]:px-0">
                      <table className="w-full border-collapse min-w-[340px] max-[480px]:min-w-[280px] [&_th]:font-['JetBrains_Mono',_ui-monospace,_monospace] [&_th]:text-[9px] [&_th]:tracking-[0.1em] [&_th]:uppercase [&_th]:text-[var(--exec-ink4)] [&_th]:text-left [&_th]:py-[7px] [&_th]:px-[8px] [&_th]:border-b-[2px] [&_th]:border-b-[var(--exec-border)] [&_th]:bg-[var(--exec-surface2)] [&_td]:p-[8px] [&_td]:text-[12px] [&_td]:border-b [&_td]:border-b-[var(--exec-border)] [&_tr:last-child_td]:border-b-0 [&_tr:hover_td]:bg-[var(--exec-surface2)] [&_td_strong]:font-['JetBrains_Mono',_ui-monospace,_monospace] [&_td_strong]:font-bold max-[640px]:[&_th]:!text-[8.5px] max-[640px]:[&_th]:!p-[6px] max-[640px]:[&_td]:!text-[10.5px] max-[640px]:[&_td]:!p-[6px] max-[480px]:[&_th]:!text-[8px] max-[480px]:[&_th]:!p-[5px] max-[480px]:[&_td]:!text-[10px] max-[480px]:[&_td]:!p-[5px]">
                        <thead>
                          <tr>{sec.table.headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, ri) => (
                            <tr key={ri}>
                              {row.cells.map((c, ci) => {
                                const inner = c.bold ? <strong>{c.text}</strong> : c.text
                                return (
                                  <td key={ci} style={c.tone ? { color: toneColor(c.tone) } : undefined}>
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
                <div className="flex gap-[8px] mt-[14px] flex-wrap max-[640px]:flex-col">
                  {panel.actions.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        `py-[8px] px-[14px] rounded-[7px] font-['IBM_Plex_Sans',_system-ui,_sans-serif] text-[11.5px] font-semibold cursor-pointer border transition-[all_0.15s] break-words max-[640px]:w-full ` +
                        (a.variant === 'solid'
                          ? 'bg-[var(--exec-brand)] text-white border-[var(--exec-brand)] hover:bg-[var(--exec-brand-dark)]'
                          : 'bg-transparent text-[var(--exec-brand)] border-[rgba(27,114,232,0.3)] hover:bg-[var(--exec-brand-light)]')
                      }
                      onClick={() => onToast(a.toastMessage)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {panel.note && (
                <div
                  className="mt-[14px] py-[10px] px-[13px] bg-[var(--exec-brand-light)] border border-[rgba(27,114,232,0.2)] rounded-[8px] text-[11px] text-[var(--exec-brand-dark)] leading-[1.5] [&_strong]:text-[var(--exec-brand-dark)] [&_strong]:font-bold"
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
