import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPathForScreen } from '@/shared/utils/navigation'

const EXAMPLE_QUERIES = [
  'Show all domestic meters in Bhelupur with consumption drop > 40%',
  'How many critical meters are in EDD-I Varanasi?',
  'Which inspector has the highest hit rate this month?',
  'List cases past SLA assigned to Sunita Verma',
  'Total revenue exposure from earth loading reports',
  'Compare AT&C loss between KVVNL and DVVNL',
  'Show feeders with SAIDI > 18 hours',
  'Which DTR has the most flagged consumers?',
]

interface QueryResult {
  query: string
  answer: string
  rows?: Array<Record<string, string>>
  type: 'text' | 'table' | 'metric'
}

function generateMockResult(query: string): QueryResult {
  const q = query.toLowerCase()
  if (q.includes('bhelupur') && q.includes('drop')) {
    return {
      query,
      type: 'table',
      answer: 'Found 89 domestic meters in Bhelupur division with consumption drop > 40% in the last 3 months:',
      rows: [
        { 'Meter ID': '#1849966', 'Consumer': 'HEERA LAL AGRAWAL', 'Drop': '-54%', 'Risk': '94', 'Status': 'New' },
        { 'Meter ID': '#1923445', 'Consumer': 'SUSHILA DEVI', 'Drop': '-38%', 'Risk': '85', 'Status': 'Inspected' },
        { 'Meter ID': '#1456789', 'Consumer': 'RAMESH PRASAD YADAV', 'Drop': '-28%', 'Risk': '76', 'Status': 'New' },
        { 'Meter ID': '#2098765', 'Consumer': 'SHARMA TRADING CO.', 'Drop': '-22%', 'Risk': '73', 'Status': 'New' },
      ],
    }
  }
  if (q.includes('inspector') && (q.includes('hit rate') || q.includes('best'))) {
    return {
      query,
      type: 'table',
      answer: 'Inspector performance ranking by hit rate (confirmed / inspected) this month:',
      rows: [
        { 'Rank': '1', 'Inspector': 'Rajesh Kumar', 'Assigned': '42', 'Inspected': '38', 'Confirmed': '26', 'Hit Rate': '68.4%' },
        { 'Rank': '2', 'Inspector': 'Amit Sharma', 'Assigned': '35', 'Inspected': '34', 'Confirmed': '22', 'Hit Rate': '64.7%' },
        { 'Rank': '3', 'Inspector': 'Sunita Verma', 'Assigned': '45', 'Inspected': '40', 'Confirmed': '24', 'Hit Rate': '60.0%' },
      ],
    }
  }
  if (q.includes('past sla') || q.includes('overdue')) {
    return {
      query,
      type: 'table',
      answer: 'Cases past SLA (3-day target):',
      rows: [
        { 'Case ID': 'C-20260215-011', 'Consumer': 'ANAND KUMAR', 'Assignee': 'Manish Gupta', 'Due': '01 Mar 2026', 'Days Late': '10d', 'Status': 'Escalated' },
        { 'Case ID': 'C-20260210-017', 'Consumer': 'LAKSHMI INDUSTRIES', 'Assignee': 'Amit Sharma', 'Due': '24 Feb 2026', 'Days Late': '15d', 'Status': 'Closed' },
      ],
    }
  }
  if (q.includes('at&c') || q.includes('atc') || q.includes('compare')) {
    return {
      query,
      type: 'table',
      answer: 'AT&C loss comparison across DISCOMs:',
      rows: [
        { 'DISCOM': 'KVVNL (Kashi)', 'AT&C Loss': '21.8%', 'Target': '20%', 'Trend': '↓ -1.8pp', 'Hit Rate': '57.9%' },
        { 'DISCOM': 'PVVNL (Pashchimanchal)', 'AT&C Loss': '18.4%', 'Target': '17%', 'Trend': '↓ -2.1pp', 'Hit Rate': '56.1%' },
        { 'DISCOM': 'MVVNL (Madhyanchal)', 'AT&C Loss': '19.2%', 'Target': '18%', 'Trend': '↓ -1.2pp', 'Hit Rate': '57.2%' },
        { 'DISCOM': 'DVVNL (Dakshinanchal)', 'AT&C Loss': '22.6%', 'Target': '21%', 'Trend': '↓ -0.8pp', 'Hit Rate': '53.6%' },
        { 'DISCOM': 'PUVVNL (Purvanchal)', 'AT&C Loss': '20.5%', 'Target': '19%', 'Trend': '↓ -1.5pp', 'Hit Rate': '63.4%' },
      ],
    }
  }
  return {
    query,
    type: 'text',
    answer: `Based on current data, here is the answer to your query: "${query}". The AI has analysed 15 lakh consumer records, 40,500 flagged meters, and 12 active diagnostic reports to produce this response. For a more detailed breakdown, try drilling into a specific scope or refining the query.`,
  }
}

export default function NLQueryPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('Show me all domestic meters in Chowk Division with consumption drop > 40% and earth loading events')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)

  function runQuery(q?: string) {
    const query = q ?? input
    if (!query.trim()) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(generateMockResult(query))
      setLoading(false)
    }, 900)
  }

  return (
    <div className="pb-2">
      <div className="mx-auto max-w-[680px]">
        {/* Hero */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl text-white text-2xl"
            style={{ background: 'var(--ai-gradient)', boxShadow: 'var(--ai-glow)' }}>
            ✦
          </div>
          <h1 className="page-title text-[22px] font-extrabold text-text">Ask your data anything</h1>
          <p className="page-sub mt-1 text-[12.5px] text-text-dim">
            Type in plain English or Hindi — AI translates to queries and returns results instantly.
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter') runQuery() }}
            placeholder="Ask anything about your network…"
            className="h-[52px] w-full rounded-[26px] border-2 bg-card px-5 pr-14 text-[13px] text-text outline-none transition-all"
            style={{ borderColor: 'var(--ai-purple)', boxShadow: '0 0 0 3px rgba(124,58,237,0.08)' }}
          />
          <button type="button" onClick={() => runQuery()}
            className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--ai-gradient)' }}>
            ➤
          </button>
        </div>

        {/* Example chips */}
        <div className="mb-6 flex flex-wrap justify-center gap-1.5">
          <span className="text-[11px] text-text-dim">Try:</span>
          {EXAMPLE_QUERIES.slice(0, 5).map((q) => (
            <button key={q} type="button" onClick={() => { setInput(q); runQuery(q) }}
              className="rounded-full border border-border bg-bg px-3 py-1 text-[11px] text-text-mid transition-all hover:border-ai-purple hover:text-ai-purple">
              {q}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="card flex items-center justify-center gap-3 py-10">
            <div className="size-5 animate-spin rounded-full border-2 border-border border-t-ai-purple" />
            <span className="text-[12px] text-text-dim">AI is querying your data…</span>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="card">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full text-[10px] text-white"
                style={{ background: 'var(--ai-gradient)' }}>✦</div>
              <span className="text-[12px] font-bold" style={{ color: 'var(--ai-purple)' }}>AI Response</span>
            </div>
            <p className="mb-3 text-[12px] leading-[1.6] text-text">{result.answer}</p>

            {result.type === 'table' && result.rows && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr className="table-header">
                      {Object.keys(result.rows[0]).map((k) => <th key={k}>{k}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row: Record<string, string>, i: number) => (
                      <tr key={i} className="table-row">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="text-[11.5px]">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button type="button" className="btn btn-ai btn-sm"
                onClick={() => navigate(getPathForScreen('meters'))}>
                View in Meters →
              </button>
              <button type="button" className="btn btn-outline btn-sm">
                📁 Export CSV
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setResult(null)}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
