import type { RoleName, UserStatus, UsersFilter } from '../types'

interface UsersFilterBarProps {
  search: string
  onSearch: (v: string) => void
  filter: UsersFilter
  onFilter: (f: UsersFilter) => void
  roleOptions: RoleName[]
  zoneOptions: string[]
  statusOptions: readonly string[]
}

/** Search + 3 dropdowns above the users table. The prototype renders these
 *  controls but leaves them unwired; we make them functional. */
export function UsersFilterBar({
  search,
  onSearch,
  filter,
  onFilter,
  roleOptions,
  zoneOptions,
  statusOptions,
}: UsersFilterBarProps) {
  return (
    <div className="usr-filter-bar">
      <input
        className="form-input usr-search"
        placeholder="🔍 Search by name, email, role..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        className="form-select usr-select"
        value={filter.role ?? ''}
        onChange={(e) =>
          onFilter({ ...filter, role: (e.target.value || undefined) as RoleName | undefined })
        }
      >
        <option value="">All roles</option>
        {roleOptions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        className="form-select usr-select"
        value={filter.zone ?? ''}
        onChange={(e) => onFilter({ ...filter, zone: e.target.value || undefined })}
      >
        <option value="">All zones</option>
        {zoneOptions.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>

      <select
        className="form-select usr-select"
        value={filter.status ?? ''}
        onChange={(e) =>
          onFilter({ ...filter, status: (e.target.value || undefined) as UserStatus | undefined })
        }
      >
        <option value="">All status</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
