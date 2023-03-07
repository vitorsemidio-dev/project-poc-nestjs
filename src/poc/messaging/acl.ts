interface User {
  id: number;
  name: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

type PermissionProps = {
  id: number;
  name: string;
  resource: string;
  resourceRegex?: RegExp;
  method: HttpMethod;
};

class Permission {
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

interface AccessControl {
  canAccess(user: User, resource: string, method: HttpMethod): boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class RBAC implements AccessControl {
  private roles: Role[];

  constructor(roles: Role[]) {
    this.roles = roles;
  }

  canAccess(user: User, resource: string, method: HttpMethod): boolean {
    // Find all the roles that the user has
    const userRoles = user.roles.map((role) => role.id);

    // Find all the permissions that are associated with those roles
    const userPermissions = this.roles
      .filter((role) => userRoles.includes(role.id))
      .flatMap((role) => role.permissions);

    // Check if any of those permissions match the resource and method
    return userPermissions.some(
      (permission) =>
        permission.resource === resource && permission.method === method,
    );
  }
}

// Example usage
const adminRole: Role = {
  id: 1,
  name: 'admin',
  permissions: [
    new Permission({
      id: 1,
      name: 'create',
      resource: '/users',
      method: 'POST',
    }),
    new Permission({ id: 2, name: 'read', resource: '/users', method: 'GET' }),
    new Permission({
      id: 3,
      name: 'update',
      resource: '/users/*',
      resourceRegex: /^\/users($|\/.*)/,
      method: 'PUT',
    }),
    new Permission({
      id: 4,
      name: 'delete',
      resource: '/users/*',
      resourceRegex: /^\/users($|\/.*)/,
      method: 'DELETE',
    }),
    new Permission({
      id: 7,
      name: 'red',
      resource: '/dashboard',
      method: 'GET',
    }),
  ],
};

const regularUserRole: Role = {
  id: 2,
  name: 'regular user',
  permissions: [
    new Permission({
      id: 5,
      name: 'read',
      resource: '/profile',
      method: 'GET',
    }),
    new Permission({
      id: 6,
      name: 'update',
      resource: '/profile',
      method: 'PUT',
    }),
  ],
};

export const user: User = {
  id: 1,
  name: 'Alice',
  roles: [adminRole, regularUserRole],
};

export const acl: AccessControl = new RBAC([adminRole, regularUserRole]);

function log() {
  console.log(acl.canAccess(user, '/users', 'GET')); // true
  console.log(acl.canAccess(user, '/users', 'POST')); // true
  console.log(acl.canAccess(user, '/users/123', 'PUT')); // true
  console.log(acl.canAccess(user, '/users/123', 'DELETE')); // true
  console.log(acl.canAccess(user, '/profile', 'GET')); // true
  console.log(acl.canAccess(user, '/profile', 'PUT')); // true
  console.log(acl.canAccess(user, '/dashboard', 'GET')); // false
}
