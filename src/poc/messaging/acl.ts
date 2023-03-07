export interface IUser {
  id: number;
  name: string;
  roles: IRole[];
}

type UserProps = {
  id: number;
  name: string;
  roles: IRole[];
};

export class User implements IUser {
  id: number;
  name: string;
  roles: IRole[];

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}

export class UserFactory {
  static create(props: UserProps): IUser {
    return new User(props);
  }
}

export interface IRole {
  id: number;
  name: string;
  permissions: Permission[];
  addPermission(permission: Permission): void;
  removePermission(permission: Permission): void;
}

type RoleProps = {
  id: number;
  name: string;
  permissions: Permission[];
};

export class Role implements IRole {
  id: number;
  name: string;
  permissions: Permission[];

  constructor(props: RoleProps) {
    Object.assign(this, props);
  }

  addPermission(permission: Permission): void {
    this.permissions.push(permission);
  }

  removePermission(permission: Permission): void {
    this.permissions = this.permissions.filter((p) => p.id !== permission.id);
  }
}

export class RoleFactory {
  static create(props: RoleProps): IRole {
    return new Role(props);
  }
}

type PermissionProps = {
  id: number;
  name: string;
  resource: string;
  resourceRegex?: RegExp;
  method: HttpMethod;
};

interface IPermission {
  id: number;
  name: string;
  resource: string;
  matches(resource: string, method: HttpMethod): boolean;
}

export class Permission implements IPermission {
  id: number;
  name: string;
  resource: string;
  resourceRegex?: RegExp;
  method: HttpMethod;

  constructor(props: PermissionProps) {
    Object.assign(this, props);
  }

  matches(resource: string, method: HttpMethod): boolean {
    const isSameMethod = this.method === method;
    const isMatchedResource =
      this.resource === resource || this.resourceRegex?.test(resource);
    return isSameMethod && isMatchedResource;
  }
}

export class PermissionFactory {
  static create(props: PermissionProps): IPermission {
    return new Permission(props);
  }
}

interface AccessControl {
  canAccess(user: IUser, resource: string, method: HttpMethod): boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class RBAC implements AccessControl {
  private roles: IRole[];

  constructor(roles: IRole[]) {
    this.roles = roles;
  }

  canAccess(user: IUser, resource: string, method: HttpMethod): boolean {
    // Find all the roles that the user has
    const userRoles = user.roles.map((role) => role.id);

    // Find all the permissions that are associated with those roles
    const userPermissions = this.roles
      .filter((role) => userRoles.includes(role.id))
      .flatMap((role) => role.permissions);

    // Check if any of those permissions match the resource and method
    return userPermissions.some((permission) =>
      permission.matches(resource, method),
    );
  }
}

export const PERMISSIONS: Record<string, Permission> = {
  createUsers: new Permission({
    id: 1,
    name: 'create',
    resource: '/users',
    method: 'POST',
  }),
  readUsers: new Permission({
    id: 2,
    name: 'read',
    resource: '/users',
    method: 'GET',
  }),
  updateUsers: new Permission({
    id: 3,
    name: 'update',
    resource: '/users/*',
    resourceRegex: /^\/users($|\/.*)/,
    method: 'PUT',
  }),
  deleteUsers: new Permission({
    id: 4,
    name: 'delete',
    resource: '/users/*',
    resourceRegex: /^\/users($|\/.*)/,
    method: 'DELETE',
  }),
  readProfile: new Permission({
    id: 5,
    name: 'read',
    resource: '/profile',
    method: 'GET',
  }),
  updateProfile: new Permission({
    id: 6,
    name: 'update',
    resource: '/profile',
    method: 'PUT',
  }),
  readDashboard: new Permission({
    id: 7,
    name: 'read',
    resource: '/dashboard',
    method: 'GET',
  }),
};

// Example usage
const adminRole: IRole = new Role({
  id: 1,
  name: 'admin',
  permissions: [
    PERMISSIONS.createUsers,
    PERMISSIONS.readUsers,
    PERMISSIONS.updateUsers,
    PERMISSIONS.deleteUsers,
    PERMISSIONS.readDashboard,
  ],
});

const regularUserRole: IRole = new Role({
  id: 2,
  name: 'regular user',
  permissions: [PERMISSIONS.readProfile, PERMISSIONS.updateProfile],
});

export const user: IUser = {
  id: 1,
  name: 'Alice',
  roles: [adminRole, regularUserRole],
};

export const regularUser: IUser = {
  id: 2,
  name: 'Asuna',
  roles: [regularUserRole],
};

export const acl: AccessControl = new RBAC([adminRole, regularUserRole]);
