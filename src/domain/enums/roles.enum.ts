export const RolesEnum = {
  ADMIN: 'admin',
  USER: 'user',
};

export type Roles = (typeof RolesEnum)[keyof typeof RolesEnum];

export const PermissionsEnum = {
  VIEW_USERS: 'view_users',
  VIEW_USERS_BY_ID: 'view_users_by_id',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',

  VIEW_ROLES: 'view_roles',
  VIEW_ROLES_BY_ID: 'view_roles_by_id',
  CREATE_ROLES: 'create_roles',
  UPDATE_ROLES: 'update_roles',
  DELETE_ROLES: 'delete_roles',

  VIEW_PERMISSIONS: 'view_permissions',
  VIEW_PERMISSIONS_BY_ID: 'view_permissions_by_id',
  CREATE_PERMISSIONS: 'create_permissions',
  UPDATE_PERMISSIONS: 'update_permissions',
  DELETE_PERMISSIONS: 'delete_permissions',

  CREATE_EXPENSE_CATEGORIES: 'create_expense_categories',
  UPDATE_EXPENSE_CATEGORIES: 'update_expense_categories',
  DELETE_EXPENSE_CATEGORIES: 'delete_expense_categories',
  VIEW_EXPENSE_CATEGORIES: 'view_expense_categories',
  VIEW_EXPENSE_CATEGORIES_BY_ID: 'view_expense_categories_by_id',

  CREATE_COST_CENTERS: 'create_cost_centers',
  UPDATE_COST_CENTERS: 'update_cost_centers',
  DELETE_COST_CENTERS: 'delete_cost_centers',
  VIEW_COST_CENTERS: 'view_cost_centers',
  VIEW_COST_CENTERS_BY_ID: 'view_cost_centers_by_id',

  CREATE_GROUPS: 'create_groups',
  UPDATE_GROUPS: 'update_groups',
  DELETE_GROUPS: 'delete_groups',
  VIEW_GROUPS: 'view_groups',
  VIEW_GROUPS_BY_ID: 'view_groups_by_id',
};

export type Permissions = (typeof PermissionsEnum)[keyof typeof PermissionsEnum];