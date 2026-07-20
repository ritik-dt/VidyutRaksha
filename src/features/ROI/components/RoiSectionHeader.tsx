interface RoiSectionHeaderProps {
  /** dot colour — a CSS var expression or hex. */
  color: string
  label: string
}

/**
 * Colored-dot + uppercase-label section divider used between ROI sections.
 * Faithful to prototype's `.roi-sec-head` (`.roi-sec-head:first-of-type`
 * had `margin-top:14px`; every other one had `margin:18px 0 8px`. We use
 * the 18px value uniformly since the first ROI section header sits above
 * the first block anyway).
 */
export function RoiSectionHeader({ color, label }: RoiSectionHeaderProps) {
  return (
    <div className="flex items-center gap-[10px] mt-[18px] mb-[8px] flex-wrap max-[480px]:mt-[14px] max-[480px]:mb-[6px] max-[480px]:gap-[8px]">
      <div
        className="w-[10px] h-[10px] rounded-full shrink-0"
        style={{ background: color }}
      />
      <div className="text-[13px] font-bold text-[var(--text)] uppercase tracking-[0.6px] max-[480px]:text-[12px] max-[480px]:tracking-[0.4px]">
        {label}
      </div>
    </div>
  )
}
