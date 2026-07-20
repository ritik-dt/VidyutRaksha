import { roleColor } from '../logic/usersLogic'
import type { User } from '../types'

interface UsersTableProps {
  users: User[]
  onEdit: (u: User) => void
}

/** All-users table. Avatar circle + role badge share the role colour. */
export function UsersTable({ users, onEdit }: UsersTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr className="table-header">
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Zone assignment</th>
            <th>Designation</th>
            <th>Cases</th>
            <th>Last active</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const rc = roleColor(u.role)
            return (
              <tr key={u.email} className="table-row">
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[30px] h-[30px] rounded-full text-white flex items-center justify-center font-bold text-[11px] shrink-0"
                      style={{ background: rc }}
                    >
                      {u.init}
                    </div>
                    <span className="font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="text-[11px] text-[var(--text-mid)]">{u.email}</td>
                <td>
                  <span
                    className="badge text-[10px]"
                    style={{ background: rc, color: '#fff' }}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="text-[11px]">{u.zone}</td>
                <td className="text-[11px]">{u.desig}</td>
                <td className="font-[var(--mono)] text-center">{u.caseCount || '—'}</td>
                <td className="text-[11px] text-[var(--text-dim)]">{u.last}</td>
                <td>
                  <span
                    className={`badge text-[10px] ${u.status === 'Active' ? 'badge-ai' : 'badge-false'}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm text-[10px]"
                    onClick={() => onEdit(u)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
