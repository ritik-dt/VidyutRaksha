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
                  <div className="usr-cell-user">
                    <div className="usr-avatar" style={{ background: rc }}>
                      {u.init}
                    </div>
                    <span className="usr-name">{u.name}</span>
                  </div>
                </td>
                <td className="usr-email">{u.email}</td>
                <td>
                  <span className="badge usr-badge-sm" style={{ background: rc, color: '#fff' }}>
                    {u.role}
                  </span>
                </td>
                <td className="usr-sm">{u.zone}</td>
                <td className="usr-sm">{u.desig}</td>
                <td className="usr-cases">{u.caseCount || '—'}</td>
                <td className="usr-last">{u.last}</td>
                <td>
                  <span
                    className={`badge usr-badge-sm ${u.status === 'Active' ? 'badge-ai' : 'badge-false'}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm usr-btn-sm"
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
