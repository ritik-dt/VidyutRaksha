interface RoiSectionHeaderProps {
  /** dot colour — a CSS var expression or hex. */
  color: string
  label: string
}

/** Colored-dot + uppercase-label section divider used between ROI sections. */
export function RoiSectionHeader({ color, label }: RoiSectionHeaderProps) {
  return (
    <div className="roi-sec-head">
      <div className="roi-sec-dot" style={{ background: color }} />
      <div className="roi-sec-title">{label}</div>
    </div>
  )
}
