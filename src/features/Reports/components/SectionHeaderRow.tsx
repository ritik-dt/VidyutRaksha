import type { ReactNode } from 'react'

interface SectionHeaderRowProps {
  color: string
  label: string
  note?: string
  /** Right-side element (e.g. a "+ New query" button). Overrides `note` when set. */
  action?: ReactNode
}

/**
 * Colored dot + uppercase label + right-side content.
 * Right side can be either a soft `note` string OR a full `action` node
 * (e.g. the "+ New query" button beside the ad-hoc header in the prototype).
 */
export function SectionHeaderRow({ color, label, note, action }: SectionHeaderRowProps) {
  return (
    <div className="flex items-center gap-[10px] mt-[18px] mb-[8px] flex-wrap max-[480px]:mt-[14px] max-[480px]:mb-[6px] max-[480px]:gap-[8px]">
      <div
        className="w-[10px] h-[10px] rounded-full shrink-0"
        style={{ background: color }}
      />
      <div className="text-[13px] font-bold text-[var(--text)] uppercase tracking-[0.6px] max-[480px]:text-[12px] max-[480px]:tracking-[0.4px]">
        {label}
      </div>
      {action ? (
        <div className="ml-auto shrink-0 max-[480px]:ml-0">{action}</div>
      ) : note ? (
        <div className="ml-auto text-[10px] text-[var(--text-dim)] max-[480px]:text-[9.5px] max-[480px]:ml-0 max-[480px]:basis-full">
          {note}
        </div>
      ) : null}
    </div>
  )
}
