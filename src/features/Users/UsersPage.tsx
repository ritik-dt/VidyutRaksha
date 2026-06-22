import { useState, type ChangeEvent } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

interface User {
  name: string; email: string; init: string; role: string; zone: string
  desig: string; last: string; status: 'Active' | 'Inactive'; caseCount: number; reports: number
}

const USERS: User[] = [
  { name: 'Rajiv Mehta', email: 'rajiv.m@uppcl.gov.in', init: 'RM', role: 'Admin', zone: 'All DISCOMs', desig: 'Vigilance Officer', last: 'Active now', status: 'Active', caseCount: 42, reports: 6 },
  { name: 'Rajesh Kumar', email: 'rajesh.k@uppcl.gov.in', init: 'RK', role: 'Inspector', zone: 'Varanasi · Bhelupur', desig: 'Sr. Inspector', last: '12 min ago', status: 'Active', caseCount: 38, reports: 0 },
  { name: 'Sunita Verma', email: 'sunita.v@uppcl.gov.in', init: 'SV', role: 'Senior Inspector', zone: 'Varanasi · Gomti Nagar', desig: 'AEN (Anti-Theft)', last: '2 hr ago', status: 'Active', caseCount: 45, reports: 2 },
  { name: 'Amit Sharma', email: 'amit.s@uppcl.gov.in', init: 'AS', role: 'Inspector', zone: 'Lucknow · Alambagh', desig: 'Inspector', last: '1 day ago', status: 'Active', caseCount: 35, reports: 0 },
  { name: 'Priya Singh', email: 'priya.s@uppcl.gov.in', init: 'PS', role: 'Inspector', zone: 'Lucknow · Rajajipuram', desig: 'Inspector', last: '3 hr ago', status: 'Active', caseCount: 22, reports: 0 },
  { name: 'Deepak Yadav', email: 'deepak.y@uppcl.gov.in', init: 'DY', role: 'Inspector', zone: 'Varanasi · Aliganj', desig: 'Inspector', last: '4 hr ago', status: 'Active', caseCount: 28, reports: 0 },
  { name: 'Manish Gupta', email: 'manish.g@uppcl.gov.in', init: 'MG', role: 'Inspector', zone: 'Varanasi · Hazratganj', desig: 'Inspector', last: '6 hr ago', status: 'Active', caseCount: 38, reports: 0 },
  { name: 'Vikash Patel', email: 'vikash.p@uppcl.gov.in', init: 'VP', role: 'Field Officer', zone: 'Chandauli / Mirzapur', desig: 'Field Officer', last: '5 days ago', status: 'Inactive', caseCount: 0, reports: 0 },
  { name: 'Priya Mishra', email: 'priya.m@uppcl.gov.in', init: 'PM', role: 'Inspector', zone: 'Jaunpur / Azamgarh', desig: 'Inspector', last: '1 hr ago', status: 'Active', caseCount: 18, reports: 0 },
]

const ROLE_COLOR: Record<string, string> = {
  Admin: 'var(--red)',
  'Senior Inspector': 'var(--ai-purple)',
  Inspector: '#0EA5E9',
  'Field Officer': 'var(--amber)',
  Analyst: 'var(--green)',
}

const ROLE_FILTERS = [
  { value: 'all', label: 'All users' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Inspector', label: 'Inspector' },
  { value: 'Senior Inspector', label: 'Senior Inspector' },
  { value: 'Field Officer', label: 'Field Officer' },
]

export default function UsersPage() {
  const { showToast } = useToast()
  const [roleFilter, setRoleFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = USERS.filter((u) => {
    const roleOk = roleFilter === 'all' || u.role === roleFilter
    const searchOk = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) || u.zone.toLowerCase().includes(search.toLowerCase())
    return roleOk && searchOk
  })

  const active = USERS.filter(u => u.status === 'Active').length

  return (
    <div className="pb-8">
      <PageHeader
        title="👥 Users & access"
        subtitle="Manage VidyutRaksha users, roles, and permissions"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Invite user', message: 'Invite link generated and sent to email.', duration: 3000 })}>
              + Invite user
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Role audit', message: 'AI reviewing role assignments for least-privilege compliance…', duration: 3500 })}>
              ✦ Role audit
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI user management">
        <strong>{active} active users</strong>, {USERS.length - active} inactive.
        Manish Gupta has the highest past-SLA rate — consider redistributing cases.
        Vikash Patel has been inactive for 5 days — verify leave status and reassign pending cases.
        All admin actions are audit-logged and cryptographically signed.
      </AiInsightBanner>

      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Total users', value: String(USERS.length), sub: 'Across all roles', accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'Active', value: String(active), sub: 'Logged in last 7 days', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Inspectors', value: String(USERS.filter(u => u.role.includes('Inspector')).length), sub: 'Field + senior', accent: '#0EA5E9', color: '#0EA5E9' },
          { label: 'Admins', value: String(USERS.filter(u => u.role === 'Admin').length), sub: 'Full access', accent: 'var(--red)', color: 'var(--red)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[24px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      <FilterBar filters={ROLE_FILTERS} active={roleFilter} onChange={setRoleFilter}
        rightSlot={
          <input type="text" value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search name, email, zone…"
            className="h-8 rounded-lg border border-border bg-card px-3 text-[11px] outline-none focus:border-ai-purple"
            style={{ width: 200 }} />
        }
      />

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>User</th><th>Role</th><th>Zone / Division</th>
                <th>Designation</th><th>Open cases</th><th>Status</th><th>Last active</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const roleColor = ROLE_COLOR[u.role] ?? 'var(--text-mid)'
                return (
                  <tr key={u.email} className="table-row">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-[11px] text-white"
                          style={{ background: u.status === 'Active' ? 'var(--navy-light)' : 'var(--text-dim)' }}>
                          {u.init}
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold text-text">{u.name}</div>
                          <div className="text-[10px] text-text-dim">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="rounded-full border px-2 py-px text-[10px] font-semibold"
                        style={{ color: roleColor, borderColor: `${roleColor}40`, background: `${roleColor}12` }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-[11.5px] text-text-mid">{u.zone}</td>
                    <td className="text-[11px] text-text">{u.desig}</td>
                    <td className="text-center font-mono font-bold text-text">{u.caseCount}</td>
                    <td>
                      <span className={`rounded-full px-2 py-px text-[10px] font-semibold ${u.status === 'Active' ? 'text-green-600' : 'text-text-dim'}`}
                        style={{ background: u.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)' }}>
                        {u.status === 'Active' ? '🟢 Active' : '⚫ Inactive'}
                      </span>
                    </td>
                    <td className="text-[11px] text-text-dim">{u.last}</td>
                    <td>
                      <div className="flex gap-1">
                        <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }}
                          onClick={() => showToast({ type: 'info', title: u.name, message: `Editing profile for ${u.name}`, duration: 2500 })}>
                          Edit
                        </button>
                        {u.status === 'Active' ? (
                          <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 8px', color: 'var(--red)' }}
                            onClick={() => showToast({ type: 'warning', title: 'Deactivated', message: `${u.name} deactivated. Cases reassigned.`, duration: 3500 })}>
                            Deactivate
                          </button>
                        ) : (
                          <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 8px', color: 'var(--green)' }}
                            onClick={() => showToast({ type: 'success', title: 'Reactivated', message: `${u.name} account reactivated.`, duration: 3000 })}>
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
