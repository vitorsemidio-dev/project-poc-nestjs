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

interface Permission {
  id: number;
  name: string;
  resource: string;
  method: HttpMethod;
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
    { id: 1, name: 'create', resource: '/users', method: 'POST' },
    { id: 2, name: 'read', resource: '/users', method: 'GET' },
    { id: 3, name: 'update', resource: '/users/*', method: 'PUT' },
    { id: 4, name: 'delete', resource: '/users/*', method: 'DELETE' },
  ],
};

const regularUserRole: Role = {
  id: 2,
  name: 'regular user',
  permissions: [
    { id: 5, name: 'read', resource: '/profile', method: 'GET' },
    { id: 6, name: 'update', resource: '/profile', method: 'PUT' },
  ],
};

const user: User = {
  id: 1,
  name: 'Alice',
  roles: [adminRole, regularUserRole],
};

const acl: AccessControl = new RBAC([adminRole, regularUserRole]);

console.log(acl.canAccess(user, '/users', 'GET')); // true
console.log(acl.canAccess(user, '/users', 'POST')); // true
console.log(acl.canAccess(user, '/users/123', 'PUT')); // true
console.log(acl.canAccess(user, '/users/123', 'DELETE')); // true
console.log(acl.canAccess(user, '/profile', 'GET')); // true
console.log(acl.canAccess(user, '/profile', 'PUT')); // true
console.log(acl.canAccess(user, '/dashboard', 'GET')); // false
