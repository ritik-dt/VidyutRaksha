import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, type ChartOptions } from "chart.js/auto";
import type { SuspMeter } from "@/features/Meters/data/meters";
import {
  getRiskTrendData,
  getRiskDriversData,
  getConsumerTimeline,
  getSimilarConsumersCluster,
} from "../data/meterChartData";
import { getRiskColor } from "@/shared/components/ui/StatusBadge";
import { ChartInfoButton } from "@/shared/components/ui/ChartInfoButton";
import { useToast } from "@/shared/context/ToastContext";
import { getPathForScreen } from "@/shared/utils/navigation";
import {
  ChartControls,
  ChartTableView,
  exportChartCSV,
  downloadChartPng,
  type ChartKind,
  type ViewMode,
} from "@/shared/components/ui/ChartViewControls";

interface RiskProfileTabProps {
  meter: SuspMeter;
}

// ─── Shared Chart.js options (mirrors prototype's `chartOpts`) ───────────────
const BASE_CHART_OPTS: ChartOptions = {
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

const DRIVER_COLORS = [
  "#DC3545",
  "#E6921E",
  "#17A2B8",
  "#7C3AED",
  "#28A745",
  "#8B95A5",
];

export function RiskProfileTab({ meter }: RiskProfileTabProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const trendData = useMemo(() => getRiskTrendData(meter.id), [meter.id]);
  const driversData = useMemo(() => getRiskDriversData(meter.id), [meter.id]);
  const timeline = useMemo(() => getConsumerTimeline(), []);
  const cluster = useMemo(
    () => getSimilarConsumersCluster(meter.id),
    [meter.id],
  );

  // ── Canvas + chart instance refs ────────────────────────────────────────────
  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const driversCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trendChartRef = useRef<Chart | null>(null);
  const driversChartRef = useRef<Chart | null>(null);

  // ── UI state: chart kind + chart/table view, per card ──────────────────────
  const [trendKind, setTrendKind] = useState<ChartKind>("line");
  const [trendView, setTrendView] = useState<ViewMode>("chart");
  const [driversKind, setDriversKind] = useState<ChartKind>("bar");
  const [driversView, setDriversView] = useState<ViewMode>("chart");

  // ── Table-view data (mirrors what each chart's canvas is showing) ──────────
  const trendTableData = useMemo(
    () => ({
      labels: trendData.map((d) => d.month),
      datasets: [
        { label: "Risk score", data: trendData.map((d) => d.risk) },
        { label: "Risk threshold", data: trendData.map((d) => d.threshold) },
      ],
    }),
    [trendData],
  );

  const driversTableData = useMemo(
    () => ({
      labels: driversData.map((d) => d.signal),
      datasets: [
        { label: "% contribution", data: driversData.map((d) => d.pct) },
      ],
    }),
    [driversData],
  );

  // ── Risk trend chart (line — vertical, mirrors prototype initRiskCharts) ───
  useEffect(() => {
    if (trendView !== "chart" || !trendCanvasRef.current) return;
    trendChartRef.current?.destroy();

    const risk = trendData.map((d) => d.risk);
    const threshold = trendData.map((d) => d.threshold);
    const isBar = trendKind === "bar";

    const datasets = [
      {
        label: "Risk score",
        data: risk,
        borderColor: "#DC3545",
        backgroundColor:
          trendKind === "area"
            ? "rgba(220,53,69,.15)"
            : isBar
              ? "#DC3545"
              : "rgba(220,53,69,.08)",
        fill: trendKind === "area",
        tension: isBar ? 0 : 0.3,
        borderWidth: isBar ? 0 : 2.5,
        pointRadius: isBar ? 0 : 3,
        pointBackgroundColor: risk.map((v) =>
          v >= 70 ? "#DC3545" : v >= 40 ? "#E6921E" : "#28A745",
        ),
        borderRadius: isBar ? 3 : 0,
        barPercentage: isBar ? 0.6 : undefined,
      },
      {
        label: "Risk threshold",
        data: threshold,
        borderColor: "#7C3AED",
        backgroundColor: isBar ? "rgba(124,58,237,.25)" : "transparent",
        borderDash: isBar ? undefined : [5, 3],
        fill: false,
        tension: 0,
        borderWidth: isBar ? 0 : 1.5,
        pointRadius: 0,
        borderRadius: isBar ? 3 : 0,
        barPercentage: isBar ? 0.6 : undefined,
      },
    ];

    trendChartRef.current = new Chart(trendCanvasRef.current, {
      type: isBar ? "bar" : "line",
      data: { labels: trendData.map((d) => d.month), datasets },
      options: BASE_CHART_OPTS,
    });

    return () => {
      trendChartRef.current?.destroy();
      trendChartRef.current = null;
    };
  }, [trendData, trendKind, trendView]);

  // ── Risk drivers chart (horizontal bar, indexAxis:'y' — mirrors prototype) ─
  useEffect(() => {
    if (driversView !== "chart" || !driversCanvasRef.current) return;
    driversChartRef.current?.destroy();

    const pct = driversData.map((d) => d.pct);
    const isBar = driversKind === "bar";

    const dataset = {
      label: "% contribution",
      data: pct,
      backgroundColor: isBar ? DRIVER_COLORS : "rgba(124,58,237,.10)",
      borderColor: isBar ? DRIVER_COLORS : DRIVER_COLORS,
      fill: driversKind === "area",
      tension: isBar ? 0 : 0.3,
      borderWidth: isBar ? 0 : 2,
      pointRadius: isBar ? 0 : 3,
      borderRadius: isBar ? 3 : 0,
      barPercentage: isBar ? 0.7 : undefined,
    };

    driversChartRef.current = new Chart(driversCanvasRef.current, {
      type: isBar ? "bar" : "line",
      data: { labels: driversData.map((d) => d.signal), datasets: [dataset] },
      options: {
        ...BASE_CHART_OPTS,
        indexAxis: "y",
        plugins: { ...BASE_CHART_OPTS.plugins, legend: { display: false } },
        scales: {
          x: {
            grid: { color: "#EDF2F7" },
            ticks: {
              font: { size: 10, family: "IBM Plex Sans" },
              color: "#8B95A5",
              callback: (v) => `${v}%`,
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 10, family: "IBM Plex Sans" },
              color: "#4A5568",
            },
          },
        },
      } as ChartOptions,
    });

    return () => {
      driversChartRef.current?.destroy();
      driversChartRef.current = null;
    };
  }, [driversData, driversKind, driversView]);

  return (
    <div>
      {/* Risk trend + Drivers */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* Risk score trend */}
        <div className="card mb-0">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="card-title flex items-center text-[13px] font-bold">
              Risk score — 12 month trend
              <ChartInfoButton chartId="risk-trend" />
            </div>
            <ChartControls
              types={["line", "area", "bar"]}
              activeType={trendKind}
              activeView={trendView}
              onTypeChange={(t) => {
                setTrendKind(t);
                setTrendView("chart");
              }}
              onTableToggle={() =>
                setTrendView((v) => (v === "table" ? "chart" : "table"))
              }
              onDownload={() =>
                downloadChartPng(
                  trendChartRef.current,
                  `VidyutRaksha_riskTrend_${meter.id}.png`,
                )
              }
            />
          </div>
          <div className="mb-3 text-[10.5px] text-text-dim">
            Risk score over last 12 months — pattern started around Nov'25
          </div>

          {trendView === "chart" ? (
            <div className="relative h-[200px]">
              <canvas ref={trendCanvasRef} />
            </div>
          ) : (
            <ChartTableView
              data={trendTableData}
              onCopyCSV={() =>
                exportChartCSV(
                  trendTableData,
                  `VidyutRaksha_riskTrend_${meter.id}.csv`,
                )
              }
            />
          )}

          <div
            className="mt-2 rounded-lg p-2.5 text-[11px]"
            style={{
              background: "rgba(220,53,69,0.06)",
              border: "1px solid rgba(220,53,69,0.15)",
            }}
          >
            <strong style={{ color: "var(--red)" }}>✦ AI: </strong>
            Risk score jumped from{" "}
            <strong>22 to 78 between Oct–Nov 2025</strong> — a 3-month ramp that
            strongly suggests theft was installed around that time. Before Oct,
            this meter had been stable at low risk for 18+ months.
          </div>
        </div>

        {/* Risk drivers */}
        <div className="card mb-0">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="card-title flex items-center text-[13px] font-bold">
              Risk drivers — rule breakdown
              <ChartInfoButton chartId="risk-drivers" />
            </div>
            <ChartControls
              types={["bar", "line", "area"]}
              activeType={driversKind}
              activeView={driversView}
              onTypeChange={(t) => {
                setDriversKind(t);
                setDriversView("chart");
              }}
              onTableToggle={() =>
                setDriversView((v) => (v === "table" ? "chart" : "table"))
              }
              onDownload={() =>
                downloadChartPng(
                  driversChartRef.current,
                  `VidyutRaksha_riskDrivers_${meter.id}.png`,
                )
              }
            />
          </div>
          <div className="mb-3 text-[10.5px] text-text-dim">
            What's contributing to the risk score — rule-wise breakdown
          </div>

          {driversView === "chart" ? (
            <div className="relative h-[200px]">
              <canvas ref={driversCanvasRef} />
            </div>
          ) : (
            <ChartTableView
              data={driversTableData}
              onCopyCSV={() =>
                exportChartCSV(
                  driversTableData,
                  `VidyutRaksha_riskDrivers_${meter.id}.csv`,
                )
              }
            />
          )}

          <div
            className="mt-2 rounded-lg p-2.5 text-[11px]"
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <strong style={{ color: "var(--ai-purple)" }}>✦ AI: </strong>
            The biggest driver ({driversData[0].pct}%) is the{" "}
            <strong>{driversData[0].signal}</strong>. {driversData[1].signal} (
            {driversData[1].pct}%) and {driversData[2].signal} (
            {driversData[2].pct}%) corroborate the signal.
          </div>
        </div>
      </div>

      {/* Consumer timeline */}
      <div className="card">
        <div className="card-title mb-4 text-[13px] font-bold">
          📅 Consumer timeline — all events in chronological order
        </div>
        <div className="relative">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {timeline.map((evt, i) => (
              <div key={i} className="relative flex items-start gap-3 pl-8">
                <div
                  className="absolute left-0 flex size-6 items-center justify-center rounded-full border border-white bg-card shadow-sm"
                  style={{
                    background: `${evt.color}20`,
                    borderColor: evt.color,
                  }}
                >
                  <div
                    className="size-2 rounded-full"
                    style={{ background: evt.color }}
                  />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-bold text-text">
                      {evt.label}
                    </span>
                    <span className="shrink-0 text-[10.5px] text-text-dim">
                      {evt.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-mid">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar consumers under same DTR (AI-detected cluster) — mirrors prototype's m.id === '1849966' block */}
      {cluster && (
        <div className="card mt-4">
          <div
            className="card-title text-[13px] font-bold"
            style={{ color: "var(--ai-purple)" }}
          >
            ✦ Similar consumers under same DTR (AI-detected cluster)
          </div>
          <div className="mb-2.5 mt-1 text-[11px] text-text-mid">
            AI has identified{" "}
            <strong>{cluster.consumers.length} other consumers</strong> under{" "}
            {cluster.dtrName} showing the same consumption signature. This
            suggests <strong>coordinated theft</strong> rather than an isolated
            case. Recommended: batch inspection of all{" "}
            {cluster.consumers.length + 1} consumers on the same day.
          </div>

          <div className="table-wrap overflow-x-auto">
            <table className="w-full text-[11.5px]">
              <thead>
                <tr className="table-header">
                  <th>Consumer</th>
                  <th>Meter</th>
                  <th>Similarity</th>
                  <th>kWh drop</th>
                  <th>Tamper events</th>
                  <th>Risk</th>
                  <th>Case</th>
                </tr>
              </thead>
              <tbody>
                {cluster.consumers.map((c) => {
                  const riskColor = getRiskColor(c.risk);
                  return (
                    <tr key={c.meter} className="table-row">
                      <td className="font-semibold text-text">{c.name}</td>
                      <td className="font-mono text-text-mid">{c.meter}</td>
                      <td
                        className="font-mono font-bold"
                        style={{ color: "var(--red)" }}
                      >
                        {c.similarity}%
                      </td>
                      <td className="font-mono" style={{ color: "var(--red)" }}>
                        {c.drop}%
                      </td>
                      <td className="font-mono text-text-mid">
                        {c.tamperEvents}
                      </td>
                      <td>
                        <div
                          className="flex size-6 items-center justify-center rounded-full border-2 font-mono text-[9px] font-extrabold"
                          style={{
                            background: `${riskColor}18`,
                            borderColor: riskColor,
                            color: riskColor,
                          }}
                        >
                          {c.risk}
                        </div>
                      </td>
                      <td>
                        <span
                          className="inline-block whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-bold"
                          style={
                            c.status === "In Progress"
                              ? {
                                  background: "rgba(245,158,11,0.1)",
                                  color: "#d97706",
                                }
                              : {
                                  background: "rgba(27,114,232,0.1)",
                                  color: "#1b72e8",
                                }
                          }
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-2.5 flex justify-end gap-1.5">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: "success",
                  title: "Batch inspection created",
                  message: `Batch inspection scheduled for all ${cluster.consumers.length + 1} consumers under ${cluster.dtrName}.`,
                  duration: 4500,
                })
              }
            >
              Create batch inspection
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => {
                showToast({
                  type: "info",
                  title: "AI analysis report",
                  message: `Generating coordinated-theft cluster report for ${cluster.dtrName}…`,
                  duration: 4000,
                });
                navigate(getPathForScreen("clusters"));
              }}
            >
              ✦ AI analysis report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
