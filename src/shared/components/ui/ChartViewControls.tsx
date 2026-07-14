import type { ReactNode } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
export type ChartKind = 'line' | 'area' | 'step' | 'bar'
export type ViewMode = 'chart' | 'table'

export interface ChartTableData {
  labels: string[]
  datasets: { label: string; data: (number | null)[] }[]
}

// ─── SVG icons (mirror prototype svgLine / svgArea / svgBar / svgTable) ──────
const IconLine = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1,11 4,6 8,8 13,2" />
  </svg>
)
const IconArea = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1,11 4,6 8,8 13,2" />
    <path d="M1,11 L4,6 L8,8 L13,2 L13,13 L1,13Z" fill="currentColor" opacity="0.15" />
  </svg>
)
const IconStep = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="1,11 1,8 5,8 5,5 9,5 9,2 13,2" />
  </svg>
)
const IconBar = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="6" width="3" height="7" rx="0.5" />
    <rect x="5.5" y="3" width="3" height="10" rx="0.5" />
    <rect x="10" y="1" width="3" height="12" rx="0.5" />
  </svg>
)
const IconTable = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="12" height="12" rx="1" />
    <line x1="1" y1="5" x2="13" y2="5" />
    <line x1="1" y1="9" x2="13" y2="9" />
    <line x1="5" y1="1" x2="5" y2="13" />
  </svg>
)

const KIND_ICONS: Record<ChartKind, ReactNode> = {
  line: <IconLine />,
  area: <IconArea />,
  step: <IconStep />,
  bar: <IconBar />,
}

// ─── ChartControls — line/area/bar toggle + table-view toggle + PNG download ─
interface ChartControlsProps {
  types: ChartKind[]
  activeType: ChartKind
  activeView: ViewMode
  onTypeChange: (t: ChartKind) => void
  onTableToggle: () => void
  onDownload: () => void
}

export function ChartControls({
  types,
  activeType,
  activeView,
  onTypeChange,
  onTableToggle,
  onDownload,
}: ChartControlsProps) {
  const btnBase =
    'flex h-[24px] w-[28px] items-center justify-center rounded border transition-all duration-150 cursor-pointer'
  const btnIdle =
    'border-border bg-card text-text-mid hover:border-[var(--ai-purple)] hover:bg-[var(--ai-purple-light)]'
  const btnActive = 'border-[var(--ai-purple)] bg-[var(--ai-purple)] text-white'

  return (
    <div className="chart-controls flex shrink-0 items-center gap-1">
      {types.map((t) => (
        <button
          key={t}
          type="button"
          title={t.charAt(0).toUpperCase() + t.slice(1)}
          onClick={() => onTypeChange(t)}
          className={`${btnBase} ${activeView === 'chart' && activeType === t ? btnActive : btnIdle}`}
        >
          {KIND_ICONS[t]}
        </button>
      ))}
      <button
        type="button"
        title="Table view"
        onClick={onTableToggle}
        className={`${btnBase} ${activeView === 'table' ? btnActive : btnIdle}`}
      >
        <IconTable />
      </button>
      <button
        type="button"
        title="Download PNG"
        onClick={onDownload}
        className={`${btnBase} ml-1 border-border bg-card text-text-dim hover:border-[var(--teal)] hover:bg-[rgba(23,162,184,.08)] hover:text-[var(--teal)]`}
      >
        <span className="text-[11px] leading-none">⬇</span>
      </button>
    </div>
  )
}

// ─── ChartTableView — table fallback + Copy CSV (mirrors toggleTableView) ────
export function ChartTableView({ data, onCopyCSV }: { data: ChartTableData; onCopyCSV: () => void }) {
  return (
    <div className="chart-table-view">
      <div className="max-h-[240px] overflow-y-auto rounded-md border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="table-header sticky top-0">
              <th className="px-2.5 py-1.5 text-left">Label</th>
              {data.datasets.map((ds) => (
                <th key={ds.label} className="px-2.5 py-1.5 text-right">
                  {ds.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.labels.map((lbl, i) => (
              <tr key={lbl} className="table-row">
                <td className="px-2.5 py-1 font-medium text-text">{lbl}</td>
                {data.datasets.map((ds) => {
                  const v = ds.data[i]
                  const fv =
                    typeof v === 'number' ? (v % 1 === 0 ? v.toLocaleString('en-IN') : v.toFixed(2)) : '—'
                  return (
                    <td key={ds.label} className="px-2.5 py-1 text-right font-mono text-text">
                      {fv}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1.5 flex justify-end">
        <button type="button" onClick={onCopyCSV} className="btn btn-outline btn-sm">
          📋 Copy CSV
        </button>
      </div>
    </div>
  )
}

// ─── Helpers (mirror prototype's exportTableCSV / downloadChart) ─────────────
// eslint-disable-next-line react-refresh/only-export-components
export function exportChartCSV(data: ChartTableData, filename: string) {
  let csv = `Label,${data.datasets.map((d) => d.label).join(',')}\n`
  data.labels.forEach((lbl, i) => {
    csv += `"${lbl}",${data.datasets.map((d) => d.data[i] ?? '').join(',')}\n`
  })
  navigator.clipboard?.writeText(csv).catch(() => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export function downloadChartPng(
  chart: { toBase64Image: () => string } | null | undefined,
  filename: string,
) {
  if (!chart) return
  const a = document.createElement('a')
  a.href = chart.toBase64Image()
  a.download = filename
  a.click()
}
