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
    <div className="my-[10px] flex flex-wrap gap-2 max-[560px]:flex-col">
      <input
        className="form-input flex-1 min-w-[200px] text-[11px] py-[6px] px-[10px] max-[560px]:w-full max-[560px]:min-w-0"
        placeholder="🔍 Search by name, email, role..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        className="form-select text-[11px] p-[6px] max-[560px]:w-full max-[560px]:min-w-0"
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
        className="form-select text-[11px] p-[6px] max-[560px]:w-full max-[560px]:min-w-0"
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
        className="form-select text-[11px] p-[6px] max-[560px]:w-full max-[560px]:min-w-0"
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
