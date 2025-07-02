export const RolesEnum = {
  ADMIN: 'admin',
  USER: 'user',
}

export type Roles = (typeof RolesEnum)[keyof typeof RolesEnum];