import { YOY_ROWS, cellColor } from '../data/yoyData'

/** YoY summary table — 6-row × 5-col direct port. */
export function YoyTable() {
  return (
    <div className="table-wrap mt-3.5">
      <table className="w-full">
        <thead>
          <tr className="table-header">
            <th>Metric</th>
            <th>2024</th>
            <th>2025</th>
            <th>2026 YTD</th>
            <th>2-yr change</th>
          </tr>
        </thead>
        <tbody>
          {YOY_ROWS.map((row) => {
            const c2024 = cellColor(row.v2024Color)
            const c2025 = cellColor(row.v2025Color)
            const c2026 = cellColor(row.v2026YtdColor)
            const cChange = cellColor(row.changeColor)
            return (
              <tr key={row.metric} className="table-row">
                <td className="font-semibold">{row.metric}</td>
                <td className="font-mono" style={c2024 ? { color: c2024 } : undefined}>
                  {row.v2024}
                </td>
                <td className="font-mono" style={c2025 ? { color: c2025 } : undefined}>
                  {row.v2025}
                </td>
                <td
                  className="font-mono font-bold"
                  style={c2026 ? { color: c2026 } : undefined}
                >
                  {row.v2026Ytd}
                </td>
                <td className="font-bold" style={cChange ? { color: cChange } : undefined}>
                  {row.change}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
