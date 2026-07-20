import type { GlanceTile } from '../types'

interface ReportsGlanceStripProps {
  tiles: GlanceTile[]
}

// Tone → bg + border + text color (inlined so the tile is one lookup).
function toneStyles(tone: string): { bg: string; border: string; color: string } {
  switch (tone) {
    case 'green':  return { bg: 'rgba(40,167,69,0.05)',  border: 'rgba(40,167,69,0.18)',  color: 'var(--green)' }
    case 'purple': return { bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.18)', color: 'var(--ai-purple)' }
    case 'red':    return { bg: 'rgba(220,53,69,0.05)',  border: 'rgba(220,53,69,0.18)',  color: 'var(--red)' }
    case 'teal':   return { bg: 'rgba(23,162,184,0.05)', border: 'rgba(23,162,184,0.18)', color: 'var(--teal)' }
    default:       return { bg: 'var(--card)',            border: 'var(--border)',         color: 'var(--text)' }
  }
}

/**
 * At-a-glance strip — 4 tone-coded tiles.
 *   Desktop → 4-col, Tablet → 2-col, Mobile → 1-col.
 * All values pre-computed in the hook (see useReports), not hardcoded.
 */
export function ReportsGlanceStrip({ tiles }: ReportsGlanceStripProps) {
  return (
    <div className="grid grid-cols-4 gap-[8px] mb-[14px] max-[900px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-[6px]">
      {tiles.map((t) => {
        const s = toneStyles(t.tone)
        return (
          <div
            key={t.id}
            className="py-[11px] px-[14px] rounded-[9px] border min-w-0 max-[480px]:py-[9px] max-[480px]:px-[12px]"
            style={{ background: s.bg, borderColor: s.border }}
          >
            <div
              className="text-[9px] font-bold tracking-[0.5px] uppercase break-words max-[480px]:text-[8.5px]"
              style={{ color: s.color }}
            >
              {t.label}
            </div>
            <div
              className="text-[18px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] leading-[1.1] mt-[2px] max-[480px]:text-[16px]"
              style={{ color: s.color }}
            >
              {t.value}
            </div>
            <div className="text-[10px] text-[var(--text-mid)] break-words max-[480px]:text-[9.5px]">
              {t.sub}
            </div>
          </div>
        )
      })}
    </div>
  )
}
