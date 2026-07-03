/**
 * ReassignInspectorPanel — exact port of prototype's openAssignPanel() /
 * renderInspectorCard(). Slides in from the right, ranks the inspector
 * directory by fit score for the current case, and lets the user assign.
 */
import { useState } from "react";
import { useToast } from "@/shared/context/ToastContext";
import {
  rankInspectors,
  INSPECTOR_DIRECTORY,
  type RankedInspector,
} from "./data/inspectors";
import type { CaseRecord } from "./types";

interface ReassignInspectorPanelProps {
  caseRecord: CaseRecord;
  theftType: string;
  onClose: () => void;
}

const STATUS_LABEL: Record<RankedInspector["status"], string> = {
  field: "In field",
  office: "In office",
  leave: "On leave",
};

const STATUS_DOT_CLASS: Record<RankedInspector["status"], string> = {
  field: "bg-green",
  office: "bg-[var(--navy-light)]",
  leave: "bg-text-dim",
};

function capacityClass(util: number): string {
  if (util < 0.6) return "bg-green";
  if (util < 0.85) return "bg-amber";
  return "bg-red";
}

const RISK_CLASS = (risk: number) =>
  risk >= 80 ? "text-red" : risk >= 60 ? "text-amber" : "text-green";

function InspectorCard({
  inspector,
  isRecommended,
  onAssign,
}: {
  inspector: RankedInspector;
  isRecommended: boolean;
  onAssign: (inspector: RankedInspector, slaDays: number) => void;
}) {
  const [slaDays, setSlaDays] = useState(3);
  const util = inspector.openCases / inspector.capacity;
  const utilPct = Math.round(util * 100);
  const isUnavailable = inspector.status === "leave";

  return (
    <div
      className={`relative mb-2.5 rounded-[10px] border p-3.5 transition-all duration-150 ${
        isRecommended
          ? "border-2 border-ai-purple shadow-[0_4px_16px_rgba(124,58,237,0.15)]"
          : "border-border hover:border-ai-purple-mid hover:shadow-[0_2px_10px_rgba(124,58,237,0.08)]"
      } ${isUnavailable ? "bg-bg opacity-55" : "bg-card"}`}
    >
      {isRecommended && (
        <span className="absolute -top-[9px] left-3.5 rounded-[10px] bg-[image:var(--ai-gradient)] px-2.5 py-[2px] text-[9px] font-bold tracking-[0.8px] text-white">
          ✦ AI PICK
        </span>
      )}

      <div className="mb-2 flex items-center gap-2.5">
        <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[image:var(--ai-gradient)] text-[13px] font-bold text-white">
          {inspector.init}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-px text-[13.5px] font-bold text-text">
            {inspector.name}
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-text-dim">
            <span
              className={`inline-block size-[7px] rounded-full ${STATUS_DOT_CLASS[inspector.status]}`}
            />
            <span>{STATUS_LABEL[inspector.status]}</span>
            <span className="text-border">·</span>
            <span>{inspector.statusDetail}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl leading-none font-bold text-ai-purple">
            {inspector.score}
          </div>
          <div className="mt-0.5 text-[9px] tracking-[0.6px] text-text-dim uppercase">
            Fit score
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${capacityClass(util)}`}
            style={{ width: `${Math.min(100, utilPct)}%` }}
          />
        </div>
        <div className="min-w-20 text-right text-[10.5px] font-semibold text-text-mid">
          {inspector.openCases}/{inspector.capacity} cases
          {inspector.pastSla > 0 && (
            <span className="ml-1 rounded-[10px] bg-[rgba(220,53,69,0.12)] px-1.5 py-px text-[9.5px] font-bold text-red">
              {inspector.pastSla} OVERDUE
            </span>
          )}
        </div>
      </div>

      <div className="mb-2 flex gap-2.5 text-[10.5px] text-text-mid">
        <span>
          📍{" "}
          <strong className="text-text">
            {inspector.areas.slice(0, 2).join(", ")}
          </strong>
        </span>
        <span>
          🎯{" "}
          <strong className="text-text">{inspector.hitRate.toFixed(0)}%</strong>{" "}
          hit rate
        </span>
        <span>
          ⏱ <strong className="text-text">{inspector.avgClose}d</strong> avg
          close
        </span>
      </div>

      <div className="mb-2 rounded-[5px] border-l-2 border-ai-purple-mid bg-bg px-2 py-1.5 text-[10.5px] leading-[1.5] text-text-mid">
        {inspector.reason}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex w-[95px] items-center gap-1">
          <span className="text-[10.5px] text-text-dim">SLA:</span>

          <input
            type="number"
            min={1}
            max={30}
            value={slaDays}
            onChange={(e) => setSlaDays(Number(e.target.value) || 1)}
            className="w-[70px] rounded-md border border-border px-2 py-1.5 text-center font-mono text-[11px]"
          />
        </div>

        <span className="text-[10.5px] text-text-dim">days</span>

        <button
          type="button"
          disabled={isUnavailable}
          onClick={() => onAssign(inspector, slaDays)}
          className="flex-1 rounded-md bg-[image:var(--ai-gradient)] py-[7px] text-[11.5px] font-bold text-white disabled:bg-border disabled:bg-none disabled:text-text-dim"
        >
          {isUnavailable ? "Unavailable" : "Assign →"}
        </button>
      </div>
    </div>
  );
}

export function ReassignInspectorPanel({
  caseRecord: cs,
  theftType,
  onClose,
}: ReassignInspectorPanelProps) {
  const { showToast } = useToast();
  const ranked = rankInspectors({ area: cs.area, theftType });

  const totalCap = INSPECTOR_DIRECTORY.reduce((s, i) => s + i.capacity, 0);
  const totalOpen = INSPECTOR_DIRECTORY.reduce((s, i) => s + i.openCases, 0);
  const overloaded = INSPECTOR_DIRECTORY.filter(
    (i) => i.openCases / i.capacity >= 0.9,
  ).length;
  const avail = INSPECTOR_DIRECTORY.filter(
    (i) => i.openCases / i.capacity < 0.5 && i.status !== "leave",
  ).length;

  function handleAssign(inspector: RankedInspector, slaDays: number) {
    showToast({
      type: "success",
      title: "✓ Inspector assigned",
      message: `${inspector.name} assigned to case ${cs.id} · SLA ${slaDays} days`,
      duration: 3500,
    });
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[9996] animate-fade-in bg-[rgba(15,43,70,0.55)]"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 bottom-0 z-[9997] flex w-[520px] max-w-[92vw] animate-slide-in-right flex-col bg-bg shadow-[-10px_0_40px_rgba(10,25,50,0.2)] dark:shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="shrink-0 border-b border-border bg-card px-5 py-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-base font-bold text-text">
              Assign inspector
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border-none bg-transparent px-1 text-[22px] leading-none text-text-dim hover:text-text"
            >
              ×
            </button>
          </div>
          <div className="text-[11.5px] text-text-mid">
            Case <strong className="text-id-text">{cs.id}</strong> ·{" "}
            {cs.consumer || "Consumer"} · Meter #{cs.meter}
          </div>
          <div className="mt-2.5 flex gap-3.5 text-[11px] text-text-mid">
            <span>
              <strong className="text-text">Area:</strong> {cs.area}
            </span>
            <span>
              <strong className="text-text">Type:</strong> {theftType}
            </span>
            <span>
              <strong className="text-text">Risk:</strong>{" "}
              <span className={`font-bold ${RISK_CLASS(cs.risk)}`}>
                {cs.risk}
              </span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-3.5 flex items-center gap-3 rounded-lg border border-ai-purple-mid bg-[linear-gradient(95deg,var(--ai-purple-light)_0%,var(--card)_100%)] px-3.5 py-2.5 text-[11.5px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-ai-purple"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <div className="flex-1">
              <div>
                <strong className="font-bold text-ai-purple">Team load:</strong>{" "}
                {totalOpen} / {totalCap} cases (
                {Math.round((totalOpen / totalCap) * 100)}% capacity)
              </div>
              <div className="mt-0.5 text-text-mid">
                {avail} available · {overloaded} near/at capacity · ranked by
                best fit for this case
              </div>
            </div>
          </div>

          {ranked.map((inspector, idx) => (
            <InspectorCard
              key={inspector.id}
              inspector={inspector}
              isRecommended={idx === 0 && inspector.score > 40}
              onAssign={handleAssign}
            />
          ))}

          <div className="mt-2.5 py-2.5 text-center text-[10.5px] text-text-dim">
            Scoring combines availability (40%), area fit (20%), skill fit
            (15%), performance (15%), status &amp; SLA penalties.
          </div>
        </div>
      </div>
    </>
  );
}
