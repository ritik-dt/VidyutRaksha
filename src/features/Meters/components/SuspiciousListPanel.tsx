import {
  useState,
  useMemo,
  useEffect,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  SUSP_METERS,
  type MeterRiskBand,
  type SuspMeter,
} from "@/features/Meters/data/meters";
import { formatIndian } from "@/shared/utils/formatters";
import { fmtINR } from "@/shared/utils/formatters";
import { useToast } from "@/shared/context/ToastContext";

const PAGE_SIZE = 25;

type SortKey = "risk" | "events" | "drop" | "recent";

interface SuspiciousListPanelProps {
  scopeId: string;
  scopeName: string;
  scopeType: string;
  totalConsumers: number;
  totalFlagged: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  estMonthlyLoss: number;
  initialBand?: MeterRiskBand;
  onClose: () => void;
}

const BAND_PILLS: {
  value: MeterRiskBand;
  label: (n: number) => string;
  activeColor: string;
  idleColor: string;
  idleBg: string;
}[] = [
  {
    value: "all",
    label: (n) => `All ${formatIndian(n)}`,
    activeColor: "var(--ai-purple)",
    idleColor: "var(--text)",
    idleBg: "var(--card)",
  },
  {
    value: "critical",
    label: (n) => `⚠ Critical ${formatIndian(n)}`,
    activeColor: "#FF4757",
    idleColor: "#D43645",
    idleBg: "rgba(255,71,87,0.08)",
  },
  {
    value: "high",
    label: (n) => `High ${formatIndian(n)}`,
    activeColor: "#E6921E",
    idleColor: "var(--amber-dark)",
    idleBg: "rgba(230,146,30,0.08)",
  },
  {
    value: "medium",
    label: (n) => `Medium ${formatIndian(n)}`,
    activeColor: "var(--amber-dark)",
    idleColor: "var(--amber-dark)",
    idleBg: "rgba(255,217,61,0.18)",
  },
  {
    value: "new",
    label: () => "✦ New today",
    activeColor: "var(--ai-purple)",
    idleColor: "var(--ai-purple)",
    idleBg: "rgba(124,58,237,0.08)",
  },
];

/**
 * Full-bleed slide-over panel matching the prototype's `openSuspiciousList()` exactly:
 * gradient purple hero header with risk-band breakdown bar, pill filter row,
 * search + sort + category, selection bulk-action bar, paginated table (25/page),
 * and footer with AI suggestion + export/schedule/auto-create buttons.
 */
export function SuspiciousListPanel({
  scopeName,
  scopeType,
  totalConsumers,
  totalFlagged,
  criticalCount,
  highCount,
  mediumCount,
  estMonthlyLoss,
  initialBand,
  onClose,
}: SuspiciousListPanelProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [band, setBand] = useState<MeterRiskBand>(initialBand ?? "all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Filter pipeline — mirrors renderSuspListPage() in the prototype exactly
  const filtered = useMemo(() => {
    let rows: SuspMeter[] = SUSP_METERS;
    if (band === "critical") rows = rows.filter((m) => m.risk >= 80);
    else if (band === "high")
      rows = rows.filter((m) => m.risk >= 60 && m.risk < 80);
    else if (band === "medium")
      rows = rows.filter((m) => m.risk >= 40 && m.risk < 60);
    else if (band === "new") rows = rows.filter((m) => m.status === "New");

    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter((m) => {
        const name = (m._consumer ?? `Consumer #${m.id}`).toLowerCase();
        return (
          m.id.toLowerCase().includes(s) ||
          (m.area ?? "").toLowerCase().includes(s) ||
          (m.cat ?? "").toLowerCase().includes(s) ||
          name.includes(s) ||
          (m._account ?? "").toLowerCase().includes(s)
        );
      });
    }

    if (category) rows = rows.filter((m) => m.cat === category);

    rows = [...rows];
    if (sortKey === "risk") rows.sort((a, b) => b.risk - a.risk);
    else if (sortKey === "events")
      rows.sort((a, b) => (b.events || 0) - (a.events || 0));
    else if (sortKey === "drop")
      rows.sort((a, b) => (a.drop || 0) - (b.drop || 0));
    // 'recent' — stable order (no explicit date field in mock data)

    return rows;
  }, [band, search, category, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const sliceStart = (currentPage - 1) * PAGE_SIZE;
  const slice = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  function toggleRow(id: string) {
    setSelected((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectVisible(checked: boolean) {
    setSelected(
      checked ? new Set(slice.map((m: SuspMeter) => m.id)) : new Set(),
    );
  }
  function clearSelection() {
    setSelected(new Set());
  }

  const selectedRows = SUSP_METERS.filter((m) => selected.has(m.id));
  const selectedLoss = selectedRows.reduce(
    (sum, m) => sum + (m.risk || 0) * Math.abs(m.drop || 0) * 1500,
    0,
  );

  function bulkAction(kind: "case" | "assign" | "notice" | "export") {
    const messages: Record<string, { title: string; message: string }> = {
      case: {
        title: "Cases created",
        message: `${selected.size} cases created and routed to nearest inspectors.`,
      },
      assign: {
        title: "Inspector assigned",
        message: `${selected.size} consumers assigned for inspection.`,
      },
      notice: {
        title: "Notices generated",
        message: `${selected.size} Section 135 draft notices generated. Awaiting SE review.`,
      },
      export: {
        title: "Export started",
        message: `Exporting ${selected.size} consumers to Excel.`,
      },
    };
    const m = messages[kind] ?? {
      title: "Action complete",
      message: `Action applied to ${selected.size} consumers.`,
    };
    showToast({
      type: "success",
      title: m.title,
      message: m.message,
      duration: 5000,
    });
    clearSelection();
  }

  function viewMeter(id: string) {
    onClose();
    navigate(`/meters/${id}`);
  }

  const flagRate =
    totalConsumers > 0
      ? ((totalFlagged / totalConsumers) * 100).toFixed(2)
      : "0.00";
  const critPct = totalFlagged > 0 ? (criticalCount / totalFlagged) * 100 : 0;
  const highPct = totalFlagged > 0 ? (highCount / totalFlagged) * 100 : 0;
  const medPct = totalFlagged > 0 ? (mediumCount / totalFlagged) * 100 : 0;

  const bandLabel =
    band === "critical"
      ? "Showing Critical (risk ≥ 80)"
      : band === "high"
        ? "Showing High (risk 60–79)"
        : band === "medium"
          ? "Showing Medium (risk 40–59)"
          : band === "new"
            ? "Showing New today"
            : "All flagged consumers";

  const breakdownBars: [string, number, string][] = [
    ["#FF4757", critPct, `Critical: ${formatIndian(criticalCount)}`],
    ["#FFA502", highPct, `High: ${formatIndian(highCount)}`],
    ["#FFD93D", medPct, `Medium: ${formatIndian(mediumCount)}`],
  ];

  const breakdownLegend: [string, string][] = [
    [
      "#FF4757",
      `Critical ${formatIndian(criticalCount)} (${Math.round(critPct)}%)`,
    ],
    ["#FFA502", `High ${formatIndian(highCount)} (${Math.round(highPct)}%)`],
    ["#FFD93D", `Medium ${formatIndian(mediumCount)} (${Math.round(medPct)}%)`],
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 cursor-pointer bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 flex h-screen w-[95vw] flex-col overflow-hidden bg-card sm:w-[90vw]"
        style={{ maxWidth: 800, borderRadius: "14px 0 0 14px" }}
      >
        {/* ===== Hero header ===== */}
        <div
          className="relative shrink-0 p-[18px_22px_16px] text-white max-sm:p-[12px_16px]"
          style={{
            background:
              "linear-gradient(135deg,rgba(124,58,237,0.95) 0%,rgba(91,33,182,0.95) 100%)",
          }}
        >
          {/* Close — always pinned top-right so it stays reachable at every width */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-white/70 hover:bg-white/15 hover:text-white"
          >
            ✕
          </button>

          <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between sm:gap-3.5">
            <div className="min-w-0 sm:flex-1">
              <div className="mb-1 flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.6px] text-white/75">
                <span
                  className="inline-block size-1.5 animate-pulse rounded-full bg-white"
                  style={{ boxShadow: "0 0 8px #fff" }}
                />
                Live theft-triage view · {scopeType} scope
              </div>
              <div className="mb-1.5 text-[18px] font-extrabold leading-tight">
                {scopeName}
              </div>
              <div className="text-[11.5px] font-medium text-white/85">
                {bandLabel} ·{" "}
                <span className="font-bold">
                  {formatIndian(filtered.length)} matching
                  {filtered.length !== SUSP_METERS.length
                    ? ` of ${formatIndian(SUSP_METERS.length)}`
                    : ""}
                </span>
              </div>
            </div>

            {/* Hero stat cluster — hidden on mobile to keep the header compact */}
            <div className="flex shrink-0 items-center gap-3.5 max-sm:hidden">
              <div className="text-left sm:text-right">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.4px] text-white/70">
                  Total flagged
                </div>
                <div className="font-mono text-[20px] font-extrabold leading-tight sm:text-[22px]">
                  {formatIndian(totalFlagged)}
                </div>
                <div className="text-[10px] text-white/70">
                  {flagRate}% of {formatIndian(totalConsumers)} consumers
                </div>
              </div>
              <div className="h-[46px] w-px bg-white/25" />
              <div className="text-left sm:text-right">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.4px] text-white/70">
                  Est. monthly exposure
                </div>
                <div
                  className="font-mono text-[20px] font-extrabold leading-tight sm:text-[22px]"
                  style={{ color: "#FFD93D" }}
                >
                  {fmtINR(estMonthlyLoss)}
                </div>
                <div className="text-[10px] text-white/70">
                  if all confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Risk band breakdown bar */}
          <div className="mt-3.5 max-sm:mt-2">
            <div className="flex h-1.5 overflow-hidden rounded-[4px] bg-white/15 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
              {breakdownBars.map(([color, pct, title]) =>
                pct > 0 ? (
                  <div
                    key={color}
                    style={{
                      width: `${pct}%`,
                      background: color,
                    }}
                    title={title}
                  />
                ) : null,
              )}
            </div>

            <div className="mt-[5px] flex flex-wrap justify-between gap-1.5 text-[10px] font-semibold text-white/85 max-sm:flex-nowrap max-sm:justify-start max-sm:overflow-x-auto">
              {breakdownLegend.map(([color, label]) => (
                <span
                  key={color}
                  className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap"
                >
                  <span
                    className="inline-block size-2 rounded-[2px]"
                    style={{ background: color }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Filter bar ===== */}
        <div
          className="shrink-0 flex flex-col gap-2.5 border-b border-border-light p-[12px_18px] max-sm:gap-2 max-sm:p-[8px_12px]"
          style={{ background: "var(--bg-soft)" }}
        >
          {/* Band pills */}
          <div className="flex flex-wrap items-center gap-1.5 max-sm:flex-nowrap max-sm:overflow-x-auto">
            <span className="mr-1 text-[9.5px] font-bold uppercase tracking-[0.5px] text-text-dim">
              Risk band:
            </span>
            {BAND_PILLS.map((p) => {
              const isActive = band === p.value;
              const count =
                p.value === "all"
                  ? totalFlagged
                  : p.value === "critical"
                    ? criticalCount
                    : p.value === "high"
                      ? highCount
                      : p.value === "medium"
                        ? mediumCount
                        : 0;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setBand(p.value);
                    setPage(1);
                  }}
                  className="shrink-0 whitespace-nowrap rounded-[14px] border px-[11px] py-[5px] text-[11px] font-semibold transition-all"
                  style={{
                    borderColor: isActive
                      ? p.activeColor
                      : p.idleColor === "var(--text)"
                        ? "var(--border)"
                        : `${p.activeColor}4D`,
                    background: isActive ? p.activeColor : p.idleBg,
                    color: isActive ? "#fff" : p.idleColor,
                  }}
                >
                  {p.label(count)}
                </button>
              );
            })}
          </div>

          {/* Search + sort + category */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-[2] sm:w-auto sm:min-w-[240px] sm:flex-1">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-text-dim">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search consumer name, meter #, area, account…"
                className="w-full rounded-lg border border-border bg-card py-[7px] pl-8 pr-2.5 text-[12px] outline-none focus:border-ai-purple focus:ring-[3px] focus:ring-ai-purple/10"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSortKey(e.target.value as SortKey)
              }
              className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2.5 py-[7px] text-[11.5px] outline-none sm:flex-none"
            >
              <option value="risk">Sort: Risk score (highest)</option>
              <option value="events">Sort: Tamper events</option>
              <option value="drop">Sort: kWh drop (steepest)</option>
              <option value="recent">Sort: Date flagged (newest)</option>
            </select>
            <select
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2.5 py-[7px] text-[11.5px] outline-none sm:flex-none"
            >
              <option value="">All categories</option>
              <option value="Domestic">Domestic</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>
          </div>
        </div>

        {/* ===== Selection action bar ===== */}
        {selected.size > 0 && (
          <div
            className="shrink-0 flex flex-col gap-2 p-[9px_18px] text-white sm:flex-row sm:items-center sm:justify-between sm:gap-2.5"
            style={{ background: "var(--ai-purple)" }}
          >
            <div className="text-[12px] font-semibold">
              {selected.size} selected ·{" "}
              <span className="opacity-85">
                Total estimated recovery:{" "}
                <strong className="font-extrabold">
                  {selectedLoss > 0 ? `${fmtINR(selectedLoss)}/month` : "—"}
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => bulkAction("case")}
                className="rounded-md border border-white/25 bg-white/15 px-3 py-[5px] text-[11px] font-semibold hover:bg-white/25"
              >
                📋 Create cases
              </button>
              <button
                type="button"
                onClick={() => bulkAction("assign")}
                className="rounded-md border border-white/25 bg-white/15 px-3 py-[5px] text-[11px] font-semibold hover:bg-white/25"
              >
                👤 Assign inspector
              </button>
              <button
                type="button"
                onClick={() => bulkAction("notice")}
                className="rounded-md border border-white/25 bg-white/15 px-3 py-[5px] text-[11px] font-semibold hover:bg-white/25"
              >
                ✉️ Generate notices
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-md border border-white/40 px-2.5 py-[5px] text-[11px]"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ===== Sub-header (fixed) — count + select-visible ===== */}
        {slice.length > 0 && (
          <div
            className="shrink-0 flex items-center justify-between border-b border-border-light p-[9px_18px] text-[10.5px] text-text-dim max-sm:p-[7px_12px]"
            style={{ background: "var(--bg-soft)" }}
          >
            <div>
              Showing{" "}
              <strong className="text-text">
                {sliceStart + 1}–
                {Math.min(sliceStart + PAGE_SIZE, filtered.length)}
              </strong>{" "}
              of <strong className="text-text">{filtered.length}</strong>
              {search || category ? " matching" : ""}
              {filtered.length !== SUSP_METERS.length
                ? ` (filtered from ${formatIndian(SUSP_METERS.length)})`
                : ""}
            </div>
            <label className="flex cursor-pointer items-center gap-1.5 font-semibold text-text-mid">
              <input
                type="checkbox"
                checked={
                  slice.length > 0 &&
                  slice.every((m: SuspMeter) => selected.has(m.id))
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  selectVisible(e.target.checked)
                }
                className="cursor-pointer"
              />
              Select visible page
            </label>
          </div>
        )}

        {/* ===== Body — ONLY the table scrolls ===== */}
        <div className="flex-1 overflow-auto bg-card">
          {slice.length === 0 ? (
            <div className="p-[60px_24px] text-center">
              <div className="mb-3 text-[38px] opacity-40">🔍</div>
              <div className="mb-1 text-[13px] font-semibold text-text-mid">
                No consumers match the current filters
              </div>
              <div className="text-[11px] text-text-dim">
                Try clearing the search or selecting a different risk band.
              </div>
            </div>
          ) : (
            <table className="w-full min-w-[460px] border-collapse text-[11.5px] md:min-w-[620px] lg:min-w-[720px]">
                <thead>
                  <tr
                    className="sticky top-0 z-[1]"
                    style={{ background: "var(--bg-soft)" }}
                  >
                    <th className="w-9 p-[9px_10px_9px_18px]"></th>
                    <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">
                      Risk
                    </th>
                    <th className="p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">
                      Consumer · Meter
                    </th>
                    <th className="hidden p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid lg:table-cell">
                      Category · Area
                    </th>
                    <th className="hidden p-[9px_10px] text-left text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid md:table-cell">
                      Top AI flag
                    </th>
                    <th
                      className="p-[9px_10px] text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid"
                      title="Monthly kWh vs 12-month baseline"
                    >
                      kWh ↓ vs baseline
                    </th>
                    <th className="p-[9px_10px] text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">
                      Tamper events
                    </th>
                    <th className="p-[9px_18px_9px_10px] text-right text-[10px] font-bold uppercase tracking-[0.5px] text-text-mid">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((m: SuspMeter) => {
                    const col =
                      m.risk >= 80
                        ? "#DC3545"
                        : m.risk >= 60
                          ? "#E6921E"
                          : "var(--amber-dark)";
                    const colBg =
                      m.risk >= 80
                        ? "rgba(220,53,69,0.08)"
                        : m.risk >= 60
                          ? "rgba(230,146,30,0.08)"
                          : "rgba(180,117,24,0.08)";
                    const displayName = m._consumer ?? `Consumer #${m.id}`;
                    const dropAbs = Math.abs(m.drop || 0);
                    const dropColor =
                      dropAbs > 30
                        ? "#DC3545"
                        : dropAbs > 15
                          ? "#E6921E"
                          : "var(--text-mid)";
                    const isSelected = selected.has(m.id);
                    const area = m.area ?? "—";
                    const truncArea =
                      area.length > 32 ? `${area.substring(0, 32)}…` : area;

                    return (
                      <tr
                        key={m.id}
                        className="cursor-pointer border-b border-border-light transition-colors"
                        style={{
                          background: isSelected
                            ? "rgba(124,58,237,0.07)"
                            : "transparent",
                        }}
                        onClick={() => viewMeter(m.id)}
                      >
                        <td
                          className="p-[11px_10px_11px_18px]"
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(m.id)}
                            className="size-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="p-[11px_10px]">
                          <div className="inline-flex flex-col items-start">
                            <div
                              className="flex size-[34px] items-center justify-center rounded-lg border-2 font-mono text-[12px] font-extrabold"
                              style={{
                                background: colBg,
                                borderColor: col,
                                color: col,
                              }}
                              title={`Risk score: ${m.risk}/100`}
                            >
                              {m.risk}
                            </div>
                            <div className="relative mt-[3px] h-1 w-[38px] overflow-hidden rounded-sm bg-black/[0.06]">
                              <div
                                className="absolute left-0 top-0 h-full rounded-sm"
                                style={{ width: `${m.risk}%`, background: col }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-[11px_10px]">
                          <div className="text-[12px] font-semibold leading-[1.3] text-text">
                            {displayName}
                            {m._real && (
                              <span
                                className="ml-[5px] inline-block rounded-[5px] border px-[5px] py-px align-middle text-[8.5px] font-extrabold"
                                style={{
                                  background: "rgba(40,167,69,.12)",
                                  color: "var(--green)",
                                  borderColor: "rgba(40,167,69,.3)",
                                }}
                              >
                                ✓ REAL
                              </span>
                            )}
                          </div>
                          <div className="mt-[3px] font-mono text-[10px] text-text-dim">
                            M#{m.id}
                            {m._account ? ` · A#${m._account}` : ""}
                          </div>
                        </td>
                        <td className="hidden p-[11px_10px] lg:table-cell">
                          <div className="text-[11px] font-medium text-text">
                            {m.cat || "—"}
                          </div>
                          <div className="mt-0.5 text-[10px] text-text-dim">
                            {truncArea}
                          </div>
                        </td>
                        <td className="hidden p-[11px_10px] md:table-cell">
                          <div className="text-[11px] font-medium leading-[1.3] text-text">
                            {m.flags?.[0] ?? "—"}
                          </div>
                          {m.flags && m.flags.length > 1 && (
                            <div className="mt-0.5 text-[9.5px] text-text-dim">
                              +{m.flags.length - 1} more
                            </div>
                          )}
                        </td>
                        <td
                          className="p-[11px_10px] text-right font-mono font-bold"
                          style={{ color: dropColor }}
                          title={`Monthly kWh down ${dropAbs}% vs 12-month baseline`}
                        >
                          {dropAbs > 0 ? (
                            <span className="inline-flex items-center gap-[3px]">
                              <span className="text-[10px]">↓</span>
                              {dropAbs}%
                            </span>
                          ) : (
                            <span className="text-text-dim">—</span>
                          )}
                        </td>
                        <td className="p-[11px_10px] text-right font-mono font-semibold">
                          {m.events ?? 0}
                        </td>
                        <td className="p-[11px_18px_11px_10px] text-right">
                          <button
                            type="button"
                            className="whitespace-nowrap rounded-md border border-border px-2.5 py-1 text-[10.5px] font-semibold text-ai-purple transition-colors hover:bg-ai-purple hover:text-white"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              viewMeter(m.id);
                            }}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
          )}
        </div>

        {/* ===== Pagination (fixed) ===== */}
        {slice.length > 0 && totalPages > 1 && (
          <div
            className="shrink-0 flex items-center justify-between border-t border-border-light p-[14px_18px] max-sm:justify-center max-sm:p-[10px_12px]"
            style={{ background: "var(--bg-soft)" }}
          >
                  <div className="text-[10.5px] text-text-dim max-sm:hidden">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-1">
                    {currentPage > 1 && (
                      <button
                        type="button"
                        onClick={() => setPage(1)}
                        className="rounded-md border border-border bg-card px-2.5 py-[5px] text-[11px] font-semibold text-text-mid max-sm:hidden"
                      >
                        « First
                      </button>
                    )}
                    {currentPage > 1 && (
                      <button
                        type="button"
                        onClick={() => setPage((p: number) => p - 1)}
                        className="rounded-md border border-border bg-card px-3 py-[5px] text-[11px] font-semibold"
                      >
                        ‹ Prev
                      </button>
                    )}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const startPg = Math.max(
                        1,
                        Math.min(currentPage - 2, totalPages - 4),
                      );
                      const p = startPg + i;
                      if (p > totalPages) return null;
                      const isCurrent = p === currentPage;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className="min-w-[28px] rounded-md border px-2.5 py-[5px] text-[11px] font-semibold"
                          style={{
                            borderColor: isCurrent
                              ? "var(--ai-purple)"
                              : "var(--border)",
                            background: isCurrent
                              ? "var(--ai-purple)"
                              : "var(--card)",
                            color: isCurrent ? "#fff" : "var(--text)",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {currentPage < totalPages && (
                      <button
                        type="button"
                        onClick={() => setPage((p: number) => p + 1)}
                        className="rounded-md border border-border bg-card px-3 py-[5px] text-[11px] font-semibold"
                      >
                        Next ›
                      </button>
                    )}
                    {currentPage < totalPages && (
                      <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        className="rounded-md border border-border bg-card px-2.5 py-[5px] text-[11px] font-semibold text-text-mid max-sm:hidden"
                      >
                        Last »
                      </button>
                    )}
                  </div>
                </div>
              )}

        {/* ===== Footer action bar ===== */}
        <div
          className="shrink-0 flex flex-col gap-2 border-t border-border-light p-[11px_18px] max-sm:p-[8px_12px] sm:flex-row sm:items-center sm:justify-between sm:gap-2.5"
          style={{
            background:
              "linear-gradient(180deg,var(--bg-soft) 0%,#EEF1F7 100%)",
          }}
        >
          <div className="text-[10.5px] font-semibold text-text-mid max-sm:hidden">
            ✦ <strong>AI suggestion:</strong> Auto-create cases for top{" "}
            {Math.min(20, criticalCount)} critical consumers — estimated 4-hour
            inspector workload.
          </div>
          <div className="flex flex-wrap gap-1.5 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:[&>button]:shrink-0">
            <button
              type="button"
              className="rounded-[7px] border border-border bg-card px-[13px] py-[7px] text-[11.5px] font-semibold text-text hover:border-ai-purple hover:text-ai-purple"
              onClick={() =>
                showToast({
                  type: "info",
                  title: "CSV export started",
                  message: `Exporting ${formatIndian(totalFlagged)} flagged consumers from ${scopeName} with full evidence.`,
                  duration: 4000,
                })
              }
            >
              📥 Export {formatIndian(totalFlagged)}
            </button>
            <button
              type="button"
              className="rounded-[7px] border border-border bg-card px-[13px] py-[7px] text-[11.5px] font-semibold text-text hover:border-ai-purple hover:text-ai-purple"
              onClick={() =>
                showToast({
                  type: "info",
                  title: "Inspection batch scheduled",
                  message: `AI optimizing route for top ${formatIndian(criticalCount)} critical consumers.`,
                  duration: 5000,
                })
              }
            >
              📅 Schedule batch
            </button>
            <button
              type="button"
              className="rounded-[7px] px-3.5 py-[7px] text-[11.5px] font-bold text-white"
              style={{
                background: "var(--ai-gradient)",
                boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
              }}
              onClick={() => {
                showToast({
                  type: "success",
                  title: "Cases auto-created",
                  message: `Created cases for top 20 critical consumers under ${scopeName}. Routed to nearest inspectors.`,
                  duration: 5000,
                });
                onClose();
              }}
            >
              ✦ Auto-create top {Math.min(20, criticalCount)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
