import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { PermissionMatrix } from './components/PermissionMatrix'
import { RoleDefinitionsGrid } from './components/RoleDefinitionsGrid'
import { UsersFilterBar } from './components/UsersFilterBar'
import { UsersKpiRow } from './components/UsersKpiRow'
import { UsersTable } from './components/UsersTable'
import { useUsers } from './hooks/useUsers'

/**
 * Users & roles — access control, role-based permissions, zone assignments.
 *
 * Faithful to the prototype's renderUsers(): state-level, NOT scope-reactive.
 * The prototype wires only its two KPI cards (via kpiClick('users', …), which
 * targets this same screen); its buttons and filter controls are left unwired,
 * and its KPI filter shows a pill without filtering the table. We keep the
 * layout and data byte-for-byte and make those controls actually work.
 */
export default function UsersPage() {
  const users = useUsers()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()

  const filterEntries: FilterPillEntry[] = []
  if (users.filter.status) filterEntries.push({ label: 'Status', value: users.filter.status })
  if (users.filter.role) filterEntries.push({ label: 'Role', value: users.filter.role })
  if (users.filter.zone) filterEntries.push({ label: 'Zone', value: users.filter.zone })

  return (
    <div className="overflow-x-hidden pb-2">
      <PageHeader
        title="👥 Users & roles"
        subtitle="Access control, role-based permissions, and zone assignments"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Bulk import',
                  message:
                    'Upload a CSV of users (name, email, role, zone, designation). Rows are validated before import.',
                  duration: 3500,
                })
              }
            >
              ⬇ Bulk import (CSV)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Permission matrix',
                  message: 'Full matrix across all 5 roles and every screen — see the table below.',
                  duration: 3500,
                })
              }
            >
              📋 Permission matrix
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'Add user',
                  message:
                    'User form will open. Assign role, zone, and designation; SSO is applied automatically.',
                  duration: 3500,
                })
              }
            >
              + Add user
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill entries={filterEntries} onClear={users.clearFilter} />
      )}

      <AiInsightBanner title={users.aiInsight.title} className="mb-[14px]">
        <span dangerouslySetInnerHTML={{ __html: users.aiInsight.bodyHtml }} />
      </AiInsightBanner>

      <UsersKpiRow kpis={users.kpis} onFilter={users.setFilter} />

      <RoleDefinitionsGrid roles={users.roles} />

      <div className="card">
        <div className="card-title">All users</div>

        <UsersFilterBar
          search={users.search}
          onSearch={users.setSearch}
          filter={users.filter}
          onFilter={users.setFilter}
          roleOptions={users.roleOptions}
          zoneOptions={users.zoneOptions}
          statusOptions={users.statusOptions}
        />

        <UsersTable
          users={users.filtered}
          onEdit={(u) => {
            showToast({
              type: 'info',
              title: 'Edit user',
              message: `${u.name} — opening profile: role, zone assignment, and permissions.`,
              duration: 3000,
            })
            logActivity('Opened user profile', 'users', u.name)
          }}
        />
      </div>

      <PermissionMatrix rows={users.permissionMatrix} role={users.permissionMatrixRole} />
    </div>
  )
}
