export type RoleType = string

export interface Roles {
  assignedRoles: RoleType[]
  effectiveRoles: RoleType[]
}

export interface Address {
  street: string
  postalCode: string
  city: string
}
