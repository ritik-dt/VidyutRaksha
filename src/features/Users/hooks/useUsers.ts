// ── useUsers (sole API seam) ─────────────────────────────────────────────────
// All Users data plus the filter state driven by the search box, the three
// dropdowns, and the clickable KPI cards. Users is state-level and NOT
// scope-reactive (the prototype does no scope filtering here).

import { useCallback, useMemo, useState } from 'react'
import { USERS_AI_INSIGHT } from '../data/aiInsight'
import { ROLE_OPTIONS, STATUS_OPTIONS, ZONE_OPTIONS } from '../data/filterOptions'
import { USER_KPIS } from '../data/kpis'
import { PERMISSION_MATRIX, PERMISSION_MATRIX_ROLE } from '../data/permissionMatrix'
import { ROLES } from '../data/roles'
import { USERS } from '../data/users'
import { filterUsers } from '../logic/usersLogic'
import type { UsersFilter } from '../types'

export function useUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<UsersFilter>({})

  const clearFilter = useCallback(() => {
    setFilter({})
    setSearch('')
  }, [])

  const filtered = useMemo(() => filterUsers(USERS, search, filter), [search, filter])

  return {
    // data
    users: USERS,
    roles: ROLES,
    kpis: USER_KPIS,
    permissionMatrix: PERMISSION_MATRIX,
    permissionMatrixRole: PERMISSION_MATRIX_ROLE,
    aiInsight: USERS_AI_INSIGHT,
    roleOptions: ROLE_OPTIONS,
    zoneOptions: ZONE_OPTIONS,
    statusOptions: STATUS_OPTIONS,

    // filter state
    search,
    setSearch,
    filter,
    setFilter,
    clearFilter,
    filtered,

    loading: false as const,
    error: null,
  }
}
