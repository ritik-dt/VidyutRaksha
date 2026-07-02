import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScope } from "@/shared/context/ScopeContext";
import { formatIndian } from "@/shared/utils/formatters";
import { fmtINR } from "@/features/Dashboard/adapter";
import { hierData } from "@/data/hierarchy";
import { getCasesScopeStats, getCaseListRows } from "./data/cases";
import { useCasesScope } from "./useCasesScope";
import { CasesKpiStrip } from "./CasesKpiStrip";
import { CasesHierarchyTable } from "./CasesHierarchyTable";
import { CasesSlaWatchlist } from "./CasesSlaWatchlist";
import { CasesAnalyticsSection } from "./CasesAnalyticsSection";
import { CasesListDrawer } from "./CasesListDrawer";
import { ScopeBreadcrumb } from "@/shared/components/ui/ScopeBreadcrumb";

interface DrawerState {
  scopeId: string;
  statusFilter?: string;
}

export default function CasesPage() {
  const navigate = useNavigate();
  const { toggleScopePicker, drillToChild } = useScope();
  const {
    scopeId,
    scopeName,
    childLabel,
    stats,
    hierarchyRows,
    watchlist,
    trend,
    realCount,
    isLeafScope,
  } = useCasesScope();
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null);

  const safeStats = stats ?? {
    total: 0,
    pastSla: 0,
    open: 0,
    inProgress: 0,
    escalated: 0,
    confirmed: 0,
    closed: 0,
    avgClose: 0,
    recovery: 0,
    active: 0,
  };

  function openDrawer(targetScopeId = scopeId, statusFilter = "") {
    setDrawerState({ scopeId: targetScopeId, statusFilter });
  }

  const drawerScope = drawerState ? hierData[drawerState.scopeId] : null;
  const drawerStats = drawerState
    ? getCasesScopeStats(drawerState.scopeId)
    : null;
  const drawerRecords = drawerState ? getCaseListRows(drawerState.scopeId) : [];

  return (
    <div className="pb-2">
      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div>
          <div className="page-title">📋 Inspection cases</div>
          <div className="page-sub">
            Hierarchical view · drill into any {childLabel} or scope down to see
            actual cases
            {realCount > 0 && (
              <span className="font-bold text-green">
                {" "}
                · {realCount} from real Mar-2026 KVVNL tamper report
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Overview
          </button>
          <button
            type="button"
            className="btn btn-ai btn-sm"
            onClick={() => openDrawer(scopeId, "Past SLA")}
          >
            ✦ AI auto-assign
          </button>
        </div>
      </div>

      {/* ── SCOPE BREADCRUMB ── */}
      <ScopeBreadcrumb
        rightActions={
          <span className="ml-auto flex items-center gap-1.5">
            <span className="text-[10.5px] font-semibold text-text-mid">
              {formatIndian(safeStats.total)} total ·{" "}
              {formatIndian(safeStats.active)} active
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm border-[rgba(124,58,237,0.3)] px-[9px] py-[3px] text-[10px] text-ai-purple"
              onClick={toggleScopePicker}
            >
              ↕ Change scope
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm px-[9px] py-[3px] text-[10px]"
              onClick={() => openDrawer(scopeId)}
            >
              📋 View {formatIndian(safeStats.total)} cases →
            </button>
          </span>
        }
      />

      {/* ── AI INSIGHT BANNER ── */}
      <div className="ai-insight mb-3.5">
        <div className="ai-insight-header">
          ✦ AI case advisor
          <span className="ai-live-badge">Live</span>
        </div>
        <div className="ai-insight-body">
          Across{" "}
          <strong style={{ color: "var(--ai-purple)" }}>{scopeName}</strong>,{" "}
          <strong className="text-red">
            {formatIndian(safeStats.pastSla)} cases are past SLA
          </strong>{" "}
          — recommend immediate escalation.{" "}
          <strong style={{ color: "var(--ai-purple)" }}>
            {formatIndian(safeStats.confirmed)} confirmed
          </strong>{" "}
          theft cases have generated assessments worth{" "}
          <strong style={{ color: "var(--ai-purple)" }}>
            {fmtINR(safeStats.recovery)}
          </strong>{" "}
          (at 62% realization). Closure rate is{" "}
          <strong
            className={safeStats.avgClose > 3 ? "text-amber" : "text-green"}
          >
            {safeStats.avgClose} days
          </strong>{" "}
          {safeStats.avgClose > 3
            ? "(above 3-day target — investigate inspector load)"
            : "(within 3-day target ✓)"}
          .{" "}
          {isLeafScope
            ? "You are at the deepest scope — the case list is below."
            : `Drill into any ${childLabel} below to narrow scope.`}
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <CasesKpiStrip
        stats={safeStats}
        onChangeFilter={(f) => openDrawer(scopeId, f === "all" ? "" : f)}
      />

      {/* ── HIERARCHY TABLE ── */}
      {hierarchyRows.length > 0 && (
        <CasesHierarchyTable
          childLabel={childLabel}
          scopeName={scopeName}
          scopeId={scopeId}
          stats={safeStats}
          rows={hierarchyRows}
          onDrill={drillToChild}
          onViewCases={openDrawer}
        />
      )}

      {/* ── SLA WATCHLIST ── */}
      <CasesSlaWatchlist
        scopeName={scopeName}
        items={watchlist}
        totalPastSla={safeStats.pastSla}
      />

      {/* ── CHARTS + AI ACTIONS ── */}
      <CasesAnalyticsSection
        scopeName={scopeName}
        stats={safeStats}
        trend={trend}
      />

      {/* ── DRAWER ── */}
      {drawerState && drawerStats && drawerScope && (
        <CasesListDrawer
          key={`${drawerState.scopeId}:${drawerState.statusFilter ?? "all"}`}
          scopeName={drawerScope.name}
          scopeType={drawerScope.type}
          stats={drawerStats}
          records={drawerRecords}
          initialStatusFilter={drawerState.statusFilter}
          onClose={() => setDrawerState(null)}
        />
      )}
    </div>
  );
}
