interface SectionHeaderRowProps {
  color: string
  label: string
  note?: string
}

/** Colored dot + uppercase label + optional right-aligned note. */
export function SectionHeaderRow({ color, label, note }: SectionHeaderRowProps) {
  return (
    <div className="rep-sec-head">
      <div className="rep-sec-dot" style={{ background: color }} />
      <div className="rep-sec-title">{label}</div>
      {note && <div className="rep-sec-note">{note}</div>}
    </div>
  )
}
