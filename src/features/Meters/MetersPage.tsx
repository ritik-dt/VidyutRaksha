import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScope } from "@/shared/context/ScopeContext";
import { ScopeBreadcrumb } from "@/shared/components/ui/ScopeBreadcrumb";
import { AiInsightBanner } from "@/shared/components/ui/AiInsightBanner";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { enrichLevel, getChildLabel } from "@/shared/utils/level";
import { fmtINR } from "@/shared/utils/formatters";
import { SUSP_METERS, getTopTargets } from "@/features/Meters/data/meters";
import { formatIndian } from "@/shared/utils/formatters";
import { getPathForScreen } from "@/shared/utils/navigation";
import { SuspiciousListPanel } from "./components/SuspiciousListPanel";
import { FlaggedConsumersTable } from "./components/FlaggedConsumersTable";
import { DiscomRiskTable } from "./components/DiscomRiskTable";
import { TopTargetCard } from "./components/TopTargetCard";
import { TheftSignaturesChart } from "./components/TheftSignaturesChart";
import { DetectionTrendChart } from "./components/DetectionTrendChart";
import { AiActionsPanel } from "./components/AiActionsPanel";
import type { MeterRiskBand } from "@/features/Meters/data/meters";

export default function MetersPage() {
  const navigate = useNavigate();
  const { currentNode, hierPath, toggleScopePicker, drillToChild } = useScope();

  const [listPanel, setListPanel] = useState<{
    open: boolean;
    band?: MeterRiskBand;
    childId?: string;
    childName?: string;
  }>({ open: false });

  const level = currentNode ? enrichLevel(currentNode) : null;
  const scopeId = hierPath[hierPath.length - 1] ?? "uppcl";
  const scopeName = level?.name ?? "UPPCL";
  const scopeType = level?.type ?? "State";
  const hasChildren = !!(level?.children && level.children.length > 0);
  const isConsumerLevel = !!level && (scopeType === "DTR" || !hasChildren);
  const childLabel = getChildLabel(scopeType);

  const flaggedCount = level?.flagged ?? 40500;
  const criticalCount = level?.critical ?? 4860;
  const highCount = level?.high ?? 13365;
  const mediumCount = level?.medium ?? 22275;
  const openCasesCount = level?.openCases ?? 7290;
  const newTodayCount = level?.newToday ?? 851;
  const estMonthlyLoss = level?.assessed
    ? Math.round(level.assessed / 12)
    : 6800000;
  const hitRate = level?.hitRate ?? 57;

  const topTargets = getTopTargets(SUSP_METERS, 5);
  const top5Exposure = topTargets.reduce((s, m) => s + m._exposure, 0);
  const top5Pct =
    estMonthlyLoss > 0 ? Math.round((top5Exposure / estMonthlyLoss) * 100) : 0;

  function openList(band?: MeterRiskBand) {
    setListPanel({ open: true, band });
  }

  function openListForChild(childId: string) {
    const child = level?.children?.find((c) => c.id === childId);
    setListPanel({ open: true, childId, childName: child?.name });
  }

  // Counts for the list panel — child-aware so opening a specific child's list
  // shows that child's totals (mirrors the prototype's openSuspiciousList(scopeId),
  // which recomputes flagged/critical/etc. for whatever scope it opens at).
  const panelChild = listPanel.childId
    ? level?.children?.find((c) => c.id === listPanel.childId)
    : undefined;
  const panelTotalFlagged = panelChild?.flagged ?? flaggedCount;
  const panelCritical = panelChild?.critical ?? criticalCount;
  const panelHigh = panelChild?.high ?? highCount;
  const panelMedium = panelChild?.medium ?? mediumCount;
  const panelTotalConsumers = panelChild?.meters ?? level?.meters ?? 1500000;
  const panelEstMonthlyLoss =
    panelChild?.assessed != null
      ? Math.round(panelChild.assessed / 12)
      : estMonthlyLoss;

  return (
    <div className="pb-2">
      {/* ===== Page header ===== */}
      <PageHeader
        title="⚠️ Suspicious meters"
        subtitle={`Hierarchical view · drill into any ${childLabel} or open the full list at any level`}
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate(getPathForScreen("dashboard"))}
              className="btn btn-outline btn-sm"
            >
              ← Overview
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() => openList()}
            >
              📋 View list at this scope
            </button>
          </>
        }
      />

      {/* ===== Scope breadcrumb ===== */}
      <ScopeBreadcrumb
        rightActions={
          <span className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                fontSize: "10px",
                padding: "3px 9px",
                color: "var(--ai-purple)",
                borderColor: "rgba(124,58,237,0.3)",
              }}
              onClick={toggleScopePicker}
            >
              ↕ Change scope
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ fontSize: "10px", padding: "3px 9px" }}
              onClick={() => openList()}
            >
              📋 View all {formatIndian(flaggedCount)} flagged →
            </button>
          </span>
        }
      />

      {/* ===== AI theft-triage banner ===== */}
      <AiInsightBanner title="AI theft-triage">
        Across{" "}
        <strong style={{ color: "var(--ai-purple)" }}>{scopeName}</strong> (
        {formatIndian(level?.meters ?? 1500000)} consumers),{" "}
        <strong style={{ color: "var(--red)" }}>
          {formatIndian(criticalCount)} are critical priority
        </strong>{" "}
        (risk ≥ 80) and{" "}
        <strong style={{ color: "var(--amber)" }}>
          {formatIndian(highCount)} high
        </strong>{" "}
        (risk 60–79).{" "}
        <strong style={{ color: "var(--ai-purple)" }}>
          {formatIndian(newTodayCount)} new flags
        </strong>{" "}
        since last batch. Estimated{" "}
        <strong style={{ color: "var(--ai-purple)" }}>
          {fmtINR(estMonthlyLoss)}/month
        </strong>{" "}
        recovery exposure if all confirmed.{" "}
        {isConsumerLevel
          ? "You are at the deepest level — the consumer list is below."
          : `Drill into any ${childLabel} below to narrow scope, or click "View list" to see the actual flagged consumers under this scope.`}
      </AiInsightBanner>

      {/* ===== KPI row ===== */}
      <div className="kpi-row">
        <button
          type="button"
          className="kpi-card clickable text-left"
          title="Risk score ≥ 80"
          onClick={() => openList("critical")}
        >
          <div className="kpi-accent" style={{ background: "var(--red)" }} />
          <div className="kpi-label">Critical</div>
          <div className="kpi-value" style={{ color: "var(--red)" }}>
            {formatIndian(criticalCount)}
          </div>
          <div className="kpi-sub">
            {flaggedCount > 0
              ? `${((criticalCount / flaggedCount) * 100).toFixed(1)}% of flagged · `
              : ""}
            risk ≥ 80
          </div>
        </button>

        <button
          type="button"
          className="kpi-card clickable text-left"
          title="Risk score 60–79"
          onClick={() => openList("high")}
        >
          <div className="kpi-accent" style={{ background: "var(--amber)" }} />
          <div className="kpi-label">High</div>
          <div className="kpi-value" style={{ color: "var(--amber)" }}>
            {formatIndian(highCount)}
          </div>
          <div className="kpi-sub">
            {flaggedCount > 0
              ? `${((highCount / flaggedCount) * 100).toFixed(1)}% of flagged · `
              : ""}
            risk 60–79
          </div>
        </button>

        <button
          type="button"
          className="kpi-card clickable text-left"
          title="Risk score 40–59"
          onClick={() => openList("medium")}
        >
          <div className="kpi-accent" style={{ background: "#F4A847" }} />
          <div className="kpi-label">Medium</div>
          <div className="kpi-value" style={{ color: "var(--amber-dark)" }}>
            {formatIndian(mediumCount)}
          </div>
          <div className="kpi-sub">
            {flaggedCount > 0
              ? `${((mediumCount / flaggedCount) * 100).toFixed(1)}% of flagged · `
              : ""}
            risk 40–59
          </div>
        </button>

        <button
          type="button"
          className="kpi-card clickable text-left"
          onClick={() => openList("new")}
        >
          <div
            className="kpi-accent"
            style={{ background: "var(--ai-purple)" }}
          />
          <div className="kpi-label">New today</div>
          <div className="kpi-value">{formatIndian(newTodayCount)}</div>
          <div className="kpi-sub">
            {flaggedCount > 0
              ? `${((newTodayCount / flaggedCount) * 100).toFixed(1)}% of flagged · `
              : ""}
            since last batch
          </div>
        </button>

        <button
          type="button"
          className="kpi-card clickable text-left"
          onClick={() => navigate(getPathForScreen("cases"))}
        >
          <div className="kpi-accent" style={{ background: "#0EA5E9" }} />
          <div className="kpi-label">Open cases</div>
          <div className="kpi-value" style={{ color: "#0EA5E9" }}>
            {formatIndian(openCasesCount)}
          </div>
          <div className="kpi-sub">
            {flaggedCount > 0
              ? `${((openCasesCount / flaggedCount) * 100).toFixed(1)}% of flagged · `
              : ""}
            assigned + in progress
          </div>
        </button>

        <div className="kpi-card">
          <div className="kpi-accent" style={{ background: "var(--green)" }} />
          <div className="kpi-label">Est. monthly loss</div>
          <div
            className="kpi-value"
            style={{ color: "var(--green)", fontSize: "18px" }}
          >
            {fmtINR(estMonthlyLoss)}
          </div>
          <div className="kpi-sub">across all flagged</div>
        </div>
      </div>

      {/* ===== DISCOM/Zone/etc table — only at non-terminal scope ===== */}
      {!isConsumerLevel && level?.children && level.children.length > 0 && (
        <DiscomRiskTable
          childLabel={childLabel}
          children={level.children}
          meters={level.meters}
          criticalCount={criticalCount}
          highCount={highCount}
          mediumCount={mediumCount}
          flaggedCount={flaggedCount}
          onRowClick={(childId) => drillToChild(childId)}
          onViewList={(childId) => openListForChild(childId)}
          onViewAll={() => openList()}
        />
      )}

      {/* ===== Top high-value targets ===== */}
      {!isConsumerLevel && (
        <div className="card" style={{ marginTop: "14px" }}>
          <div className="card-title mb-2.5 flex items-center justify-between">
            <span className="text-[14px] font-bold">
              🎯 Top high-value targets · {scopeName} · this week
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] text-text-dim">
                Ranked by estimated monthly recovery
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: "10px", padding: "3px 9px" }}
                onClick={() => openList("critical")}
              >
                View all critical →
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {topTargets.map((m, i) => (
              <TopTargetCard key={m.id} meter={m} rank={i + 1} />
            ))}
          </div>

          <div
            className="mt-[11px] flex items-center justify-between rounded-lg p-[9px_12px] text-[11px]"
            style={{
              background: "rgba(40,167,69,0.06)",
              border: "1px dashed rgba(40,167,69,0.3)",
              color: "#1e7e34",
            }}
          >
            <div>
              <strong>Combined exposure of top 5:</strong>{" "}
              {fmtINR(top5Exposure)} per month · acting on these 5 alone could
              capture <strong>~{top5Pct}% of total monthly loss</strong>
            </div>
          </div>
        </div>
      )}

      {/* ===== Charts row: theft signatures + detection trend ===== */}
      {!isConsumerLevel && (
        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1fr_1.2fr]">
          <TheftSignaturesChart scopeId={scopeId} scopeName={scopeName} />
          <DetectionTrendChart
            scopeName={scopeName}
            flagged={level?.flagged}
            hitRate={hitRate}
            rising={flaggedCount > 4000}
          />
        </div>
      )}

      {/* ===== AI recommended actions ===== */}
      {!isConsumerLevel && (
        <div className="mt-3.5">
          <AiActionsPanel
            scopeName={scopeName}
            criticalCount={criticalCount}
            highCount={highCount}
            estMonthlyLoss={estMonthlyLoss}
          />
        </div>
      )}

      {/* ===== Consumer-level (DTR) — terminal scope shows the full inline table ===== */}
      {isConsumerLevel && <FlaggedConsumersTable scopeName={scopeName} />}

      {/* ===== Suspicious list slide-over (works at any scope level) ===== */}
      {listPanel.open && (
        <SuspiciousListPanel
          scopeId={listPanel.childId ?? scopeId}
          scopeName={listPanel.childName ?? scopeName}
          scopeType={scopeType}
          totalConsumers={panelTotalConsumers}
          totalFlagged={panelTotalFlagged}
          criticalCount={panelCritical}
          highCount={panelHigh}
          mediumCount={panelMedium}
          estMonthlyLoss={panelEstMonthlyLoss}
          initialBand={listPanel.band}
          onClose={() => setListPanel({ open: false })}
        />
      )}
    </div>
  );
}
