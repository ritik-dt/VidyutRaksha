import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chart, registerables } from 'chart.js'
import { useToast } from '@/shared/context/ToastContext'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { ChartInfoButton } from '@/shared/components/ui/ChartInfoButton'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useConsumer } from './hooks/useConsumer'
import type { Consumer, ConsumerCase, ConsumerCommunication, ConsumerMeter, ConsumerNote } from './data/consumerData'

Chart.register(...registerables)

/** Prototype's payment-history bar color rule: red > 10 days, amber > 5, green else. */
function paymentColor(daysLate: number): string {
  if (daysLate > 10) return '#DC3545'
  if (daysLate > 5) return '#E6921E'
  return '#28A745'
}

/** Prototype's risk-circle class rule. */
function riskCircleClass(risk: number): string {
  if (risk >= 70) return 'risk-circle risk-high'
  if (risk >= 40) return 'risk-circle risk-mid'
  return 'risk-circle risk-low'
}

/** Prototype's meter status → badge class. */
function meterBadgeClass(status: ConsumerMeter['status']): string {
  if (status === 'Theft confirmed') return 'badge badge-confirmed'
  if (status === 'Under review')    return 'badge badge-assigned'
  if (status === 'Escalated')       return 'badge badge-escalated'
  return 'badge badge-active'
}

/** Prototype's case status → badge class. */
function caseBadgeClass(status: ConsumerCase['status']): string {
  if (status === 'Active')       return 'badge badge-confirmed'
  if (status === 'Escalated')    return 'badge badge-escalated'
  if (status === 'Under review') return 'badge badge-assigned'
  return 'badge badge-false'
}

/** Communication icon colors — match the prototype's coloring per kind. */
function commColor(kind: ConsumerCommunication['kind']): string {
  if (kind === 'email')    return 'var(--ai-purple)'
  if (kind === 'sms')      return 'var(--amber)'
  if (kind === 'call')     return 'var(--teal, #17a2b8)'
  return 'var(--green)'
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ConsumerHeaderActions({ consumer }: { consumer: Consumer }) {
  const { showToast } = useToast()
  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Contact initiated',
            message: `Calling ${consumer.phone} on file for ${consumer.name}.`,
            duration: 3500,
          })
        }
      >
        📞 Contact
      </button>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => {
          const el = document.getElementById('officer-notes-textarea') as HTMLTextAreaElement | null
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.focus()
          }
        }}
      >
        📝 Add note
      </button>
      <button
        type="button"
        className="btn btn-ai btn-sm"
        onClick={() =>
          showToast({
            type: 'ai',
            title: 'AI risk re-assessment',
            message:
              'Re-scoring consumer against latest 30-day meter data + peer group. Result in under 2 min.',
            duration: 5000,
          })
        }
      >
        ✦ AI risk assessment
      </button>
    </>
  )
}

function ConsumerKpiRow({ consumer }: { consumer: Consumer }) {
  const { showToast } = useToast()
  const years = new Date().getFullYear() - consumer.since
  const paymentColor2 = consumer.paymentScore >= 85 ? 'var(--green)' : consumer.paymentScore >= 60 ? 'var(--amber)' : 'var(--red)'
  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Risk score</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{consumer.risk.score}</div>
        <div className="kpi-sub">{consumer.risk.level}</div>
      </div>
      <div
        className="kpi-card clickable"
        onClick={() =>
          showToast({
            type: 'info',
            title: 'Meter list',
            message: `Filtering suspicious meters view to consumer ${consumer.name}.`,
            duration: 3500,
          })
        }
      >
        <div className="kpi-accent" style={{ background: 'var(--navy-light, #4B6BB8)' }} />
        <div className="kpi-label">Active meters</div>
        <div className="kpi-value">{consumer.activeMeters}</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">Consumer since</div>
        <div className="kpi-value">{consumer.since}</div>
        <div className="kpi-sub">{years} year{years === 1 ? '' : 's'}</div>
      </div>
      <Link to="/cases" className="kpi-card clickable" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Active cases</div>
        <div className="kpi-value">{consumer.activeCases}</div>
      </Link>
      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Payment score</div>
        <div className="kpi-value" style={{ color: paymentColor2 }}>{consumer.paymentScore}</div>
        <div className="kpi-sub">Was {consumer.paymentScorePrevious} until Nov&apos;25</div>
      </div>
    </div>
  )
}

function ConsumerDetailsCard({ consumer }: { consumer: Consumer }) {
  const rows: Array<[string, React.ReactNode]> = [
    ['Full name:', <span style={{ fontWeight: 600 }}>{consumer.name}</span>],
    ['Account number:', <span style={{ fontFamily: 'var(--mono)' }}>{consumer.accountNumber}</span>],
    ['Category:', <>{consumer.category}</>],
    ['Sanctioned load:', <>{consumer.sanctionedLoad}</>],
    ['Tariff:', <>{consumer.tariff}</>],
    ['Address:', <>{consumer.address.line1}<br />{consumer.address.cityPin}</>],
    ['Phone:', <>{consumer.phone}{' '}{consumer.phoneVerified && <span style={{ color: 'var(--green)', fontSize: 10 }}>✓ Verified</span>}</>],
    ['Email:', <>{consumer.email}</>],
    ['GSTIN:', <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{consumer.gstin}</span>],
    ['DTR:', <>{consumer.dtr}</>],
  ]
  return (
    <div className="card min-w-0">
      <div className="card-title">📋 Consumer details</div>
      <div className="consumer-details-grid" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, fontSize: 12, lineHeight: 1.8 }}>
        {rows.map(([label, value], i) => (
          <React.Fragment key={i}>
            <div className="consumer-details-label" style={{ color: 'var(--text-dim)' }}>{label}</div>
            <div className="consumer-details-value">{value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function PaymentHistoryCard({ consumer }: { consumer: Consumer }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()
    const labels = consumer.paymentSeries.map((p) => p.label)
    const data = consumer.paymentSeries.map((p) => p.daysLate)
    const colors = data.map(paymentColor)
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Days after due date',
            data,
            backgroundColor: colors,
            borderRadius: 3,
            barPercentage: 0.6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              padding: 12,
              font: { size: 10.5, family: 'IBM Plex Sans, sans-serif' },
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels: () => [
                { text: 'Days after due date', fillStyle: '#28A745', strokeStyle: '#28A745', pointStyle: 'circle' as const, hidden: false, index: 0, lineWidth: 0 },
              ],
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} day${ctx.parsed.y === 1 ? '' : 's'} late`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5, font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
          x: {
            ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, autoSkipPadding: 6 },
            grid: { display: false },
          },
        },
      },
    })
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [consumer.paymentSeries])

  return (
    <div className="card min-w-0">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>📊 Payment history (last 24 months)</span>
        <ChartInfoButton chartId="payment-score" />
      </div>
      <div className="chart-container-lg">
        <canvas ref={canvasRef} />
      </div>
      {consumer.paymentAnomaly && (
        <div style={{ marginTop: 8, padding: 8, background: 'rgba(230,146,30,.08)', borderRadius: 6, fontSize: 11 }}>
          <strong>⚠ Anomaly:</strong> {consumer.paymentAnomaly}
        </div>
      )}
    </div>
  )
}

function MetersTable({ consumer }: { consumer: Consumer }) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">All meters under this account</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>Meter #</th>
              <th>Location</th>
              <th>Sanctioned</th>
              <th>Last reading</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consumer.meters.map((m) => (
              <tr key={m.id} className="table-row">
                <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--id-text, #0284c7)' }}>{m.id}</td>
                <td style={{ fontSize: 11 }}>{m.location}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{m.sanctioned}</td>
                <td style={{ fontSize: 11 }}>{m.lastReading}</td>
                <td>
                  <div className={riskCircleClass(m.risk)} style={{ width: 24, height: 24, fontSize: 9 }}>{m.risk}</div>
                </td>
                <td>
                  <span className={meterBadgeClass(m.status)}>{m.status}</span>
                </td>
                <td>
                  {m.detailPath ? (
                    <Link to={m.detailPath} className="btn btn-outline btn-sm" style={{ fontSize: 10, textDecoration: 'none' }}>
                      View →
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: 10 }}>View →</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CaseHistoryCard({ cases }: { cases: ConsumerCase[] }) {
  return (
    <div className="card min-w-0">
      <div className="card-title">🗂️ Case history</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cases.map((c, i) => {
          const isActive = c.status === 'Active' || c.status === 'Escalated'
          const border = isActive ? 'var(--red)' : 'var(--text-dim)'
          const bg = isActive ? 'rgba(220,53,69,.06)' : 'var(--bg)'
          const titleColor = isActive ? 'var(--red)' : 'var(--text-mid)'
          const inner = (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: titleColor, fontSize: 12 }}>{c.id}</div>
                <span className={caseBadgeClass(c.status)}>{c.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>
                {c.section} · {c.amount}
              </div>
              {c.assignedTo && (
                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                  Assigned to {c.assignedTo}{c.dueDate ? ` · Due ${c.dueDate}` : ''}
                </div>
              )}
            </>
          )
          if (isActive) {
            return (
              <Link
                key={c.id + i}
                to={`/cases/${c.id}`}
                style={{ padding: 10, borderLeft: `3px solid ${border}`, background: bg, borderRadius: 6, textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                {inner}
              </Link>
            )
          }
          return (
            <div key={c.id + i} style={{ padding: 10, borderLeft: `3px solid ${border}`, background: bg, borderRadius: 6 }}>
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CommunicationCard({ items }: { items: ConsumerCommunication[] }) {
  return (
    <div className="card min-w-0">
      <div className="card-title">📨 Communication history</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
        {items.map((c, i) => {
          const isLast = i === items.length - 1
          return (
            <div
              key={c.title + i}
              style={{
                display: 'flex',
                gap: 6,
                padding: '6px 0',
                borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
              }}
            >
              <span style={{ color: commColor(c.kind) }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <strong>{c.title}</strong>
                <div style={{ color: 'var(--text-dim)', fontSize: 10 }}>{c.meta}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OfficerNotesCard({ notes }: { notes: ConsumerNote[] }) {
  const { showToast } = useToast()
  return (
    <div className="card">
      <div className="card-title">📝 Officer notes on this consumer</div>
      <textarea
        id="officer-notes-textarea"
        className="form-input"
        placeholder="Add an internal note about this consumer (visible only to officers)..."
        style={{ width: '100%', minHeight: 60, fontSize: 12, padding: 10, resize: 'vertical' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            const el = e.currentTarget
            const value = el.value.trim()
            if (value) {
              showToast({ type: 'success', title: 'Note saved', message: 'In production this note will be persisted against the consumer record.', duration: 3000 })
              el.value = ''
            }
          }
        }}
      />
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {notes.map((n) => (
          <div key={n.officer + n.date} style={{ padding: '8px 10px', background: 'var(--bg)', borderRadius: 6, borderLeft: '3px solid var(--ai-purple)' }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>
              {n.officer}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400, marginLeft: 6 }}>· {n.role} · {n.date}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

/**
 * Consumer 360° detail page — port of prototype's `renderConsumer(consumerId)`.
 * Fully API-ready: the page renders whatever data `useConsumer()` returns.
 * Swap the body of `getConsumerById` in `data/consumerData.ts` with a real
 * `fetch('/api/consumers/…')` call and no component code needs to change.
 */
export default function ConsumerDetailPage() {
  const navigate = useNavigate()
  const { consumer } = useConsumer()

  return (
    <div className="consumer-detail-page overflow-x-hidden pb-2">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to suspicious meters
      </button>

      <PageHeader
        title={`👤 ${consumer.name}`}
        subtitle={`Consumer 360° view · Account #${consumer.accountNumber} · Consumer since ${consumer.since}`}
        actions={<ConsumerHeaderActions consumer={consumer} />}
      />

      <AiInsightBanner title="AI consumer profile">
        {consumer.aiProfile.split(/(\*\*|__|<strong>|<\/strong>)/).length > 1 ? (
          consumer.aiProfile
        ) : (
          <>
            <strong>{consumer.name}</strong> is a commercial consumer (LMV2) operating from{' '}
            {consumer.address.line1.replace(',', '')}, {consumer.address.cityPin.split(' - ')[0]}. Has{' '}
            <strong>{consumer.activeMeters} active meters</strong> under this account.{' '}
            <strong>Red flag indicators:</strong> meter #{consumer.meters[0]?.id} shows 50 earth loading events and
            −54% consumption drop. Payment history:{' '}
            <strong>consistent on-time for 7 years, then delayed payments started Nov 2025</strong> — correlates
            with theft start. <strong>Risk profile: {consumer.risk.level}</strong> ({consumer.risk.score}/100).
          </>
        )}
      </AiInsightBanner>

      <ConsumerKpiRow consumer={consumer} />

      <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
        <ConsumerDetailsCard consumer={consumer} />
        <PaymentHistoryCard consumer={consumer} />
      </div>

      <MetersTable consumer={consumer} />

      <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
        <CaseHistoryCard cases={consumer.cases} />
        <CommunicationCard items={consumer.communications} />
      </div>

      <OfficerNotesCard notes={consumer.notes} />
    </div>
  )
}
