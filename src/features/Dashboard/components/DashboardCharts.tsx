import { useEffect, useMemo, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { useScope } from "@/shared/context/ScopeContext";
import { ChartInfoButton } from "@/shared/components/ui/ChartInfoButton";
import { getPathForScreen } from "@/shared/utils/navigation";
import {
  enrichLevel,
  getChildLabel,
  isConsumerLevel,
} from "../adapter";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChartKind = "line" | "area" | "bar";
type ViewMode = "chart" | "table";

// ─── Raw trend data (mirrors prototype `trendData`) ──────────────────────────

const TREND_RAW = {
  labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  flagged: [2890, 3120, 3450, 3620, 3710, 3841],
  inspected: [920, 1050, 1100, 1150, 1180, 1204],
  confirmed: [510, 598, 621, 655, 670, 687],
};

// Base meter count used for proportional scaling (matches prototype)
const BASE_METERS = 142_867;

// ─── Shared Chart.js options (mirrors prototype `chartOpts`) ─────────────────

const BASE_CHART_OPTS: Chart["options"] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 10,
        font: { size: 10, family: "IBM Plex Sans" },
      },
    },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#1A1A2E",
      bodyColor: "#4A5568",
      borderColor: "#E2E8F0",
      borderWidth: 1,
      padding: 8,
      cornerRadius: 8,
      titleFont: { size: 11, family: "IBM Plex Sans" },
      bodyFont: { size: 11, family: "IBM Plex Sans" },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, family: "IBM Plex Sans" }, color: "#8B95A5" },
    },
    y: {
      grid: { color: "#EDF2F7" },
      ticks: { font: { size: 10, family: "IBM Plex Sans" }, color: "#8B95A5" },
    },
  },
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconLine = () => (
  <svg
    viewBox="0 0 14 14"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polyline points="1,11 4,6 8,8 13,2" />
  </svg>
);

const IconArea = () => (
  <svg
    viewBox="0 0 14 14"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polyline points="1,11 4,6 8,8 13,2" />
    <path
      d="M1,11 L4,6 L8,8 L13,2 L13,13 L1,13Z"
      fill="currentColor"
      opacity="0.15"
    />
  </svg>
);

const IconBar = () => (
  <svg
    viewBox="0 0 14 14"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="6" width="3" height="7" rx="0.5" />
    <rect x="5.5" y="3" width="3" height="10" rx="0.5" />
    <rect x="10" y="1" width="3" height="12" rx="0.5" />
  </svg>
);

const IconTable = () => (
  <svg
    viewBox="0 0 14 14"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="1" width="12" height="12" rx="1" />
    <line x1="1" y1="5" x2="13" y2="5" />
    <line x1="1" y1="9" x2="13" y2="9" />
    <line x1="5" y1="1" x2="5" y2="13" />
  </svg>
);

const CHART_KIND_ICONS: Record<ChartKind, ReactNode> = {
  line: <IconLine />,
  area: <IconArea />,
  bar: <IconBar />,
};

// ─── ChartControls component (mirrors prototype .chart-controls) ──────────────

interface ChartControlsProps {
  id: string;
  types: ChartKind[];
  activeType: ChartKind;
  activeView: ViewMode;
  onTypeChange: (t: ChartKind) => void;
  onTableToggle: () => void;
  onDownload: () => void;
}

function ChartControls({
  types,
  activeType,
  activeView,
  onTypeChange,
  onTableToggle,
  onDownload,
}: ChartControlsProps) {
  const btnBase =
    "flex h-[24px] w-[28px] items-center justify-center rounded border transition-all duration-150 cursor-pointer";
  const btnIdle =
    "border-[var(--border)] bg-[var(--card)] text-[var(--text-mid)] hover:border-[var(--ai-purple)] hover:bg-[var(--ai-purple-light)]";
  const btnActive =
    "border-[var(--ai-purple)] bg-[var(--ai-purple)] text-white";
  const btnTableActive =
    "border-[var(--ai-purple)] bg-[var(--ai-purple)] text-white";

  return (
    <div className="chart-controls flex items-center gap-1">
      {types.map((t) => (
        <button
          key={t}
          type="button"
          title={t.charAt(0).toUpperCase() + t.slice(1)}
          onClick={() => onTypeChange(t)}
          className={`${btnBase} ${activeView === "chart" && activeType === t ? btnActive : btnIdle}`}
        >
          {CHART_KIND_ICONS[t]}
        </button>
      ))}

      {/* Table toggle */}
      <button
        type="button"
        title="Table view"
        onClick={onTableToggle}
        className={`${btnBase} ${activeView === "table" ? btnTableActive : btnIdle}`}
      >
        <IconTable />
      </button>

      {/* Download */}
      <button
        type="button"
        title="Download PNG"
        onClick={onDownload}
        className={`${btnBase} ml-1 border-[var(--border)] bg-[var(--card)] text-[var(--text-dim)] hover:border-[var(--teal)] hover:bg-[rgba(23,162,184,.08)] hover:text-[var(--teal)]`}
      >
        <span className="text-[11px] leading-none">⬇</span>
      </button>
    </div>
  );
}

// ─── ChartTableView component ─────────────────────────────────────────────────

interface TableData {
  labels: string[];
  datasets: { label: string; data: (number | null)[] }[];
}

function ChartTableView({
  data,
  onCopyCSV,
}: {
  data: TableData;
  onCopyCSV: () => void;
}) {
  return (
    <div className="chart-table-view mt-[-4px]">
      <div className="max-h-[240px] overflow-y-auto rounded border border-[var(--border)]">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="sticky top-0 bg-[var(--navy-mid)]">
              <th className="px-2 py-1.5 text-left font-semibold text-[var(--text-mid)]">
                Label
              </th>
              {data.datasets.map((ds) => (
                <th
                  key={ds.label}
                  className="px-2 py-1.5 text-right font-semibold text-[var(--text-mid)]"
                >
                  {ds.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.labels.map((lbl, i) => (
              <tr
                key={lbl}
                className="border-t border-[var(--border-light)] hover:bg-[var(--bg)]"
              >
                <td className="px-2 py-1 font-medium text-[var(--text)]">
                  {lbl}
                </td>
                {data.datasets.map((ds) => {
                  const v = ds.data[i];
                  const fv =
                    typeof v === "number"
                      ? v % 1 === 0
                        ? v.toLocaleString("en-IN")
                        : v.toFixed(2)
                      : "—";
                  return (
                    <td
                      key={ds.label}
                      className="px-2 py-1 text-right font-mono text-[var(--text)]"
                    >
                      {fv}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1.5 flex justify-end">
        <button
          type="button"
          onClick={onCopyCSV}
          className="rounded border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[10.5px] text-[var(--text-mid)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-colors"
        >
          📋 Copy CSV
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDatasets(
  kind: ChartKind,
  rawDatasets: {
    label: string;
    data: number[];
    borderColor: string;
    bgColor: string;
    bgColorArea: string;
    barColors?: string[];
  }[],
) {
  return rawDatasets.map((ds) => {
    const isBar = kind === "bar";
    return {
      label: ds.label,
      data: ds.data,
      borderColor: ds.borderColor,
      backgroundColor: isBar
        ? (ds.barColors ?? ds.bgColor)
        : kind === "area"
          ? ds.bgColorArea
          : ds.bgColor,
      fill: kind === "area",
      tension: isBar ? 0 : 0.3,
      borderWidth: 2,
      pointRadius: isBar ? 0 : 2,
      borderRadius: isBar ? 3 : 0,
      barPercentage: isBar ? 0.6 : undefined,
      stepped: false,
    };
  });
}

function exportCSV(tableData: TableData, filename: string) {
  let csv = "Label," + tableData.datasets.map((d) => d.label).join(",") + "\n";
  tableData.labels.forEach((lbl, i) => {
    csv +=
      `"${lbl}",` +
      tableData.datasets.map((d) => d.data[i] ?? "").join(",") +
      "\n";
  });
  navigator.clipboard.writeText(csv).catch(() => {
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardCharts() {
  const navigate = useNavigate();
  const { currentNode } = useScope();

  // Canvas refs
  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chart instance refs (avoid stale closures)
  const trendChartRef = useRef<Chart | null>(null);
  const lossChartRef = useRef<Chart | null>(null);

  // UI state
  const [trendKind, setTrendKind] = useState<ChartKind>("line");
  const [lossKind, setLossKind] = useState<ChartKind>("bar");
  const [trendView, setTrendView] = useState<ViewMode>("chart");
  const [lossView, setLossView] = useState<ViewMode>("chart");

  // ── Derived level ──────────────────────────────────────────────────────────
  const level = useMemo(
    () => (currentNode ? enrichLevel(currentNode) : null),
    [currentNode],
  );

  const childLabel = level ? getChildLabel(level.type) : "DISCOM";
  const showCharts = level && !isConsumerLevel(level.type);
  const meters = level?.meters ?? BASE_METERS;

  // ── Trend chart data (proportionally scaled to the scope's meter count) ────
  const trendTableData = useMemo<TableData>(
    () => ({
      labels: TREND_RAW.labels,
      datasets: [
        {
          label: "Flagged",
          data: TREND_RAW.flagged.map((v) =>
            Math.round((v * meters) / BASE_METERS),
          ),
        },
        {
          label: "Inspected",
          data: TREND_RAW.inspected.map((v) =>
            Math.round((v * meters) / BASE_METERS),
          ),
        },
        {
          label: "Confirmed",
          data: TREND_RAW.confirmed.map((v) =>
            Math.round((v * meters) / BASE_METERS),
          ),
        },
      ],
    }),
    [meters],
  );

  // ── Loss chart data (children ranked by AT&C, mirroring prototype) ─────────
  const lossChartData = useMemo(() => {
    if (!level?.children?.length) {
      // Fallback static data (prototype default)
      return {
        labels: ["DVVNL", "KVVNL", "PUVVNL", "MVVNL", "PVVNL"],
        data: [22.8, 23.8, 21.4, 19.2, 10.4],
      };
    }
    const sorted = [...level.children].sort(
      (a, b) => (b.loss ?? 0) - (a.loss ?? 0),
    );
    return {
      labels: sorted.map((c) =>
        c.name.length > 20 ? c.name.substring(0, 18) + "…" : c.name,
      ),
      data: sorted.map((c) => c.loss ?? 0),
    };
  }, [level]);

  const lossTableData = useMemo<TableData>(
    () => ({
      labels: lossChartData.labels,
      datasets: [{ label: "AT&C Loss %", data: lossChartData.data }],
    }),
    [lossChartData],
  );

  // ── Bar colour helper (mirrors prototype: red > 22, amber > 18, green) ──────
  const lossBarColors = useMemo(
    () =>
      lossChartData.data.map((v: number) =>
        v > 22 ? "#DC3545" : v > 18 ? "#E6921E" : "#28A745",
      ),
    [lossChartData],
  );

  const maxLoss = useMemo(
    () => Math.max(...lossChartData.data, 0),
    [lossChartData],
  );

  // ── Download handler ────────────────────────────────────────────────────────
  const downloadChart = (which: "trend" | "loss") => {
    const chart =
      which === "trend" ? trendChartRef.current : lossChartRef.current;
    if (!chart) return;
    const url = chart.toBase64Image();
    const a = document.createElement("a");
    a.href = url;
    a.download = `VidyutRaksha_${which}.png`;
    a.click();
  };

  // ── Trend chart effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!showCharts || !trendCanvasRef.current) return;

    trendChartRef.current?.destroy();

    const scaledFlagged = trendTableData.datasets[0].data as number[];
    const scaledInspected = trendTableData.datasets[1].data as number[];
    const scaledConfirmed = trendTableData.datasets[2].data as number[];

    const rawDs = [
      {
        label: "Flagged",
        data: scaledFlagged,
        borderColor: "#DC3545",
        bgColor: "rgba(220,53,69,.06)",
        bgColorArea: "rgba(220,53,69,.15)",
      },
      {
        label: "Inspected",
        data: scaledInspected,
        borderColor: "#E6921E",
        bgColor: "rgba(230,146,30,.04)",
        bgColorArea: "rgba(230,146,30,.12)",
      },
      {
        label: "Confirmed",
        data: scaledConfirmed,
        borderColor: "#28A745",
        bgColor: "rgba(40,167,69,.06)",
        bgColorArea: "rgba(40,167,69,.15)",
      },
    ];

    const datasets = buildDatasets(trendKind, rawDs);

    trendChartRef.current = new Chart(trendCanvasRef.current, {
      type: trendKind === "bar" ? "bar" : "line",
      data: { labels: TREND_RAW.labels, datasets },
      options: BASE_CHART_OPTS,
    });

    return () => {
      trendChartRef.current?.destroy();
      trendChartRef.current = null;
    };
  }, [showCharts, trendKind, trendTableData, trendView]);

  // ── Loss chart effect ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!showCharts || !lossCanvasRef.current) return;

    lossChartRef.current?.destroy();

    const rawDs = [
      {
        label: "AT&C Loss %",
        data: lossChartData.data,
        borderColor: "#DC3545",
        bgColor: "rgba(220,53,69,.04)",
        bgColorArea: "rgba(220,53,69,.15)",
        barColors: lossBarColors,
      },
    ];

    const datasets = buildDatasets(lossKind, rawDs);

    lossChartRef.current = new Chart(lossCanvasRef.current, {
      type: lossKind === "bar" ? "bar" : "line",
      data: { labels: lossChartData.labels, datasets },
      options: {
        ...BASE_CHART_OPTS,
        plugins: {
          ...BASE_CHART_OPTS.plugins,
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 10,
              font: {
                size: 10,
                family: "IBM Plex Sans",
              },
            },
          },
        },
        scales: {
          ...(BASE_CHART_OPTS.scales ?? {}),
          y: {
            ...(((BASE_CHART_OPTS.scales ?? {}) as any).y ?? {}),
            beginAtZero: false,
            max: Math.ceil(maxLoss),
            ticks: {
              stepSize: 1,
              font: { size: 10, family: "IBM Plex Sans" },
              color: "#8B95A5",
              callback: (v: unknown) => `${Number(v).toFixed(1)}%`,
            },
          },
        },
      } as Chart["options"],
    });

    return () => {
      lossChartRef.current?.destroy();
      lossChartRef.current = null;
    };
  }, [showCharts, lossKind, lossChartData, lossBarColors, lossView, maxLoss]);

  // ── Guard: don't render at consumer (DTR) level ────────────────────────────
  if (!showCharts) return null;

  const hitRate = level?.hitRate ?? 57;

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-[14px] max-lg:grid-cols-1">
      {/* ===== Card 1: Detection Funnel Trend ============================= */}
      <div className="card mb-0">
        {/* Header */}
        <div className="chart-header mb-[10px] flex items-start justify-between">
          <div>
            <div className="flex items-center text-[12px] font-bold text-[var(--text)]">
              📈 Detection funnel · 12-month trend
              <ChartInfoButton chartId="detection-trend" />
            </div>
            <div className="mt-[1px] text-[10.5px] text-[var(--text-dim)]">
              Flagged → Inspected → Confirmed · is the conversion improving?
            </div>
          </div>
          <ChartControls
            id="trend"
            types={["line", "area", "bar"]}
            activeType={trendKind}
            activeView={trendView}
            onTypeChange={(t) => {
              setTrendKind(t);
              setTrendView("chart");
            }}
            onTableToggle={() =>
              setTrendView((v: ViewMode) => (v === "table" ? "chart" : "table"))
            }
            onDownload={() => downloadChart("trend")}
          />
        </div>

        {/* Chart or Table */}
        {trendView === "chart" ? (
          <div className="chart-container relative h-[200px]">
            <canvas ref={trendCanvasRef} />
          </div>
        ) : (
          <ChartTableView
            data={trendTableData}
            onCopyCSV={() =>
              exportCSV(trendTableData, "VidyutRaksha_trend.csv")
            }
          />
        )}

        {/* AI insight strip */}
        <div
          className="mt-2 rounded-md p-[7px_10px] text-[10.5px] leading-[1.45] text-[var(--text-mid)]"
          style={{ background: "rgba(124,58,237,0.06)" }}
        >
          <strong className="text-[var(--ai-purple)]">✦ AI:</strong>{" "}
          Flag-to-confirm conversion improving — hit rate now{" "}
          <strong>{hitRate}%</strong> vs 51% start of year. Inspection backlog
          narrowing.
        </div>
      </div>

      {/* ===== Card 2: Loss Concentration ================================= */}
      <div className="card mb-0">
        {/* Header */}
        <div className="chart-header mb-[10px] flex items-start justify-between">
          <div>
            <div className="flex items-center text-[12px] font-bold text-[var(--text)]">
              🎯 Where is the loss concentrated?
              <ChartInfoButton chartId="child-loss" />
            </div>
            <div className="mt-[1px] text-[10.5px] text-[var(--text-dim)]">
              By {childLabel.toLowerCase()} · ranked by AT&C — drill to focus
              inspection effort
            </div>
          </div>
          <ChartControls
            id="div"
            types={["bar", "line", "area"]}
            activeType={lossKind}
            activeView={lossView}
            onTypeChange={(t) => {
              setLossKind(t);
              setLossView("chart");
            }}
            onTableToggle={() =>
              setLossView((v: ViewMode) => (v === "table" ? "chart" : "table"))
            }
            onDownload={() => downloadChart("loss")}
          />
        </div>

        {/* Chart or Table */}
        {lossView === "chart" ? (
          <div className="chart-container relative h-[200px]">
            <canvas ref={lossCanvasRef} />
          </div>
        ) : (
          <ChartTableView
            data={lossTableData}
            onCopyCSV={() => exportCSV(lossTableData, "VidyutRaksha_loss.csv")}
          />
        )}

        {/* AI insight strip — clickable, navigates to compare screen */}
        <div
          className="mt-2 cursor-pointer rounded-md p-[7px_10px] text-[10.5px] leading-[1.45] text-[var(--text-mid)] transition-opacity hover:opacity-80"
          style={{ background: "rgba(220,53,69,0.06)" }}
          role="button"
          tabIndex={0}
          onClick={() => navigate(getPathForScreen("compare"))}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ")
              navigate(getPathForScreen("compare"));
          }}
        >
          <strong className="text-[var(--red)]">✦ AI:</strong> Top-2{" "}
          {childLabel.toLowerCase()}s account for <strong>~60%</strong> of total
          loss above technical baseline. Pareto signal — focus inspection
          resources here for max recovery per rupee spent.{" "}
          <span className="underline">Compare DISCOMs →</span>
        </div>
      </div>
    </div>
  );
}
