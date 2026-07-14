/**
 * Case status badge — exact port of the prototype's sBadge() colour map.
 * Extracted so the list drawer and the leaf-scope case table share one source
 * of truth (no duplicate badge definitions).
 */
const STATUS_MAP: Record<string, string> = {
  Assigned: 'border-[#0EA5E94d] bg-[rgba(14,165,233,0.1)] text-[#0EA5E9]',
  'In Progress': 'border-[#E6921E4d] bg-[rgba(230,146,30,0.1)] text-[#E6921E]',
  Escalated: 'border-[#DC35454d] bg-[rgba(220,53,69,0.1)] text-[#DC3545]',
  'Confirmed Theft': 'border-[#28A7454d] bg-[rgba(40,167,69,0.1)] text-[#28A745]',
  'False Positive': 'border-[#6B72804d] bg-[rgba(107,114,128,0.1)] text-[#6B7280]',
  Closed: 'border-[#6B72804d] bg-[rgba(107,114,128,0.1)] text-[#6B7280]',
}

export function CaseStatusBadge({ status }: { status: string }) {
  const cls =
    STATUS_MAP[status] ??
    'border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.05)] text-text-dim'
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-[10px] border px-2 py-0.5 text-[9.5px] font-bold tracking-[0.2px] ${cls}`}
    >
      {status}
    </span>
  )
}
