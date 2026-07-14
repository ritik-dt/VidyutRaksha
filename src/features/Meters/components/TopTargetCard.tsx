import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fmtINR } from "@/shared/utils/formatters";
import { useToast } from "@/shared/context/ToastContext";
import type { SuspMeter } from "@/features/Meters/data/meters";

interface TopTargetCardProps {
  meter: SuspMeter & { _exposure: number };
  rank: number;
}

/**
 * Exact replica of the prototype's "Top high-value targets" row:
 * #rank · risk badge (38px) · name+meter+area · est.recovery · action buttons
 * Gradient background fading from risk color, 4px left border, hover translateX.
 */
export function TopTargetCard({ meter: m, rank }: TopTargetCardProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const riskColor =
    m.risk >= 80 ? "#DC3545" : m.risk >= 60 ? "#E6921E" : "var(--amber-dark)";
  const riskBg =
    m.risk >= 80
      ? "rgba(220,53,69,0.08)"
      : m.risk >= 60
        ? "rgba(230,146,30,0.08)"
        : "rgba(180,117,24,0.08)";
  const displayName = m._consumer ?? `Consumer #${m.id}`;
  const area = m.area ?? "";
  const truncatedArea = area.length > 32 ? `${area.substring(0, 32)}…` : area;

  return (
    <div
      className="group flex cursor-pointer flex-col gap-3 rounded-lg border p-[11px_14px] transition-all duration-150 hover:translate-x-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center"
      style={{
        background: `linear-gradient(90deg, ${riskBg} 0%, transparent 70%)`,
        borderLeft: `4px solid ${riskColor}`,
        borderTopColor: isHovered ? riskColor : "var(--border-light)",
        borderRightColor: isHovered ? riskColor : "var(--border-light)",
        borderBottomColor: isHovered ? riskColor : "var(--border-light)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/meters/${m.id}`)}
    >
      {/* Left cluster: rank + risk badge + name/meta (fills width, truncates) */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Rank */}
        <div className="w-6 shrink-0 text-center font-mono text-[14px] font-extrabold text-text-dim">
          #{rank}
        </div>

        {/* Risk badge */}
        <div
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[9px] border-2 font-mono text-[13px] font-extrabold"
          style={{
            background: riskBg,
            borderColor: riskColor,
            color: riskColor,
          }}
        >
          {m.risk}
        </div>

        {/* Name / meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center text-[13px] font-bold leading-[1.3] text-text">
            <span className="truncate">{displayName}</span>
            {m._real && (
              <span
                className="ml-[5px] inline-block shrink-0 rounded-[5px] border px-[5px] py-px align-middle text-[8.5px] font-extrabold"
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
          <div className="mt-0.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10.5px] text-text-dim">
            <span className="font-mono">M#{m.id}</span>
            <span>
              · {m.cat ?? "—"} · {m.sl ?? "—"}
            </span>
            <span>· {truncatedArea}</span>
          </div>
        </div>
      </div>

      {/* Right cluster: est. recovery + actions.
          On mobile it drops to a second row and spreads apart; inline on desktop. */}
      <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
        {/* Est. recovery */}
        <div className="text-left sm:text-right">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.4px] text-text-dim">
            Est. recovery
          </div>
          <div
            className="font-mono text-[15px] font-extrabold"
            style={{ color: "var(--green)" }}
          >
            {fmtINR(m._exposure)}
          </div>
          <div className="text-[9.5px] text-text-dim">/month if confirmed</div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            className="whitespace-nowrap rounded-md px-[10px] py-[5px] text-[10px] font-bold text-white"
            style={{ background: "var(--ai-gradient)" }}
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              showToast({
                type: "success",
                title: "Case created",
                message: `Case opened for ${displayName} · routed to nearest inspector.`,
                duration: 4000,
              });
            }}
          >
            ✦ Create case
          </button>
          <button
            type="button"
            className="whitespace-nowrap rounded-md border border-border px-[10px] py-[5px] text-[10px] font-semibold text-ai-purple"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              navigate(`/meters/${m.id}`);
            }}
          >
            View detail →
          </button>
        </div>
      </div>
    </div>
  );
}
