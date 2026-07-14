import { TAG_COLORS } from '../data/photos'
import type { Photo } from '../types'

interface PhotoCardProps {
  photo: Photo
  onClick?: (p: Photo) => void
}

/**
 * Single evidence-photo card — matches the prototype layout exactly:
 * dark 1.5:1 aspect placeholder, verified/AI-confidence badges top-left,
 * GPS bottom-right, type + P-ID header, consumer · case, inspector · date,
 * color-cycled tag chips, optional amber flag banner.
 */
export function PhotoCard({ photo: p, onClick }: PhotoCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(p)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(p)
        }
      }}
      className="cursor-pointer overflow-hidden rounded-lg border border-border bg-bg transition-transform duration-150 hover:-translate-y-0.5"
    >
      {/* placeholder */}
      <div
        className="relative flex items-center justify-center text-[48px] text-white"
        style={{
          aspectRatio: '1.5',
          background: 'linear-gradient(135deg,#2D3748,#4A5568)',
        }}
      >
        <span>📷</span>

        {/* badges top-left */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span
            className="inline-block rounded-[10px] px-2 py-[3px] text-[9px] font-bold whitespace-nowrap"
            style={
              p.verified
                ? { background: 'rgba(40,167,69,0.12)', color: 'var(--green)' }
                : { background: 'rgba(230,146,30,0.12)', color: 'var(--amber)' }
            }
          >
            {p.verified ? '✓ Verified' : 'Review'}
          </span>
          <span
            className="inline-block rounded-[10px] px-2 py-[3px] text-[9px] font-bold whitespace-nowrap"
            style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--ai-purple)' }}
          >
            {p.aiConf}% AI conf
          </span>
        </div>

        {/* GPS bottom-right */}
        <div
          className="absolute right-2 bottom-2 rounded font-mono text-[9px] text-white"
          style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 6px' }}
        >
          {p.gps}
        </div>
      </div>

      {/* meta */}
      <div className="p-2.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="text-[12px] font-bold text-text">{p.type}</div>
          <div className="font-mono text-[10px] text-text-dim">{p.id}</div>
        </div>
        <div className="mb-1 text-[10px] text-text-mid">
          {p.consumer} · {p.case}
        </div>
        <div className="text-[10px] text-text-dim">
          {p.inspector} · {p.date}
        </div>

        {/* tag chips */}
        <div className="mt-1.5 flex flex-wrap gap-[3px]">
          {p.tags.map((tag, i) => {
            const c = TAG_COLORS[i % TAG_COLORS.length]
            return (
              <span
                key={tag}
                className="rounded-[10px] px-1.5 py-[2px] text-[9px] font-semibold"
                style={{ background: `${c}22`, color: c }}
              >
                #{tag}
              </span>
            )
          })}
        </div>

        {/* optional AI flag */}
        {p.flag && (
          <div
            className="mt-1.5 rounded text-[10px]"
            style={{
              padding: '4px 6px',
              background: 'var(--amber-light)',
              color: 'var(--amber-dark, #92400e)',
            }}
          >
            <strong>⚠</strong> {p.flag}
          </div>
        )}
      </div>
    </div>
  )
}
