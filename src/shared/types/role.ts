import type { ScreenName } from './navigation'

export type RoleId =
  | 'cmd'
  | 'chief'
  | 'se'
  | 'ee'
  | 'aen'
  | 'analyst'

export interface RoleScope {
  type: string
  name: string
}

export interface Role {
  id: RoleId
  label: string
  level: string
  icon: string
  description: string
  scope: string
  defaultScope: RoleScope
  landing: ScreenName
  allowedScreens: ScreenName[]
  readOnlyScreens: ScreenName[]
}
