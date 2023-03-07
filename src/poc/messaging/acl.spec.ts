import { user, regularUser, acl, RBAC, Role, PERMISSIONS } from './acl';

describe('ACL - user with roles [admin, regular user]', () => {
  it('should be able to allow access GET /users', async () => {
    const output = acl.canAccess(user, '/users', 'GET');
    expect(output).toBe(true);
  });
  it('should be able to allow access POST /users', async () => {
    const output = acl.canAccess(user, '/users', 'POST');
    expect(output).toBe(true);
  });
  it('should be able to allow access PUT /users/123', async () => {
    const output = acl.canAccess(user, '/users/123', 'PUT');
    expect(output).toBe(true);
  });
  it('should be able to allow access DELETE /users/123', async () => {
    const output = acl.canAccess(user, '/users/123', 'DELETE');
    expect(output).toBe(true);
  });
  it('should be able to allow access GET /profile', async () => {
    const output = acl.canAccess(user, '/profile', 'GET');
    expect(output).toBe(true);
  });
  it('should be able to allow access PUT /profile', async () => {
    const output = acl.canAccess(user, '/profile', 'PUT');
    expect(output).toBe(true);
  });
  it('should be able to allow access GET /dashboard', async () => {
    const output = acl.canAccess(user, '/dashboard', 'GET');
    expect(output).toBe(true);
  });
});

describe('ACL - user with roles [regular user]', () => {
  it('should not be able to access GET /users', async () => {
    const output = acl.canAccess(regularUser, '/users', 'GET');
    expect(output).toBe(false);
  });
  it('should not be able to access POST /users', async () => {
    const output = acl.canAccess(regularUser, '/users', 'POST');
    expect(output).toBe(false);
  });
  it('should not be able to access PUT /users/123', async () => {
    const output = acl.canAccess(regularUser, '/users/123', 'PUT');
    expect(output).toBe(false);
  });
  it('should not be able to access DELETE /users/123', async () => {
    const output = acl.canAccess(regularUser, '/users/123', 'DELETE');
    expect(output).toBe(false);
  });
  it('should be able to allow access GET /profile', async () => {
    const output = acl.canAccess(regularUser, '/profile', 'GET');
    expect(output).toBe(true);
  });
  it('should be able to allow access PUT /profile', async () => {
    const output = acl.canAccess(regularUser, '/profile', 'PUT');
    expect(output).toBe(true);
  });
  it('should not be able to access GET /dashboard', async () => {
    const output = acl.canAccess(regularUser, '/dashboard', 'GET');
    expect(output).toBe(false);
  });
});

describe('ACL - adding permissions to roles', () => {
  it('should be able to add permission to read users', async () => {
    const anyRole: Role = { id: 1, name: 'any', permissions: [] };
    const anyUser = { id: 1, name: 'any', roles: [anyRole] };
    const aclReadUsers = new RBAC([anyRole]);

    const outputWithoutPermission = aclReadUsers.canAccess(
      anyUser,
      '/users',
      'GET',
    );
    anyRole.permissions.push(PERMISSIONS.readUsers);
    const outputWithPermission = aclReadUsers.canAccess(
      anyUser,
      '/users',
      'GET',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });

  it('should be able to add permission to delete users', async () => {
    const anyRole: Role = { id: 1, name: 'any', permissions: [] };
    const anyUser = { id: 1, name: 'any', roles: [anyRole] };
    const aclDeleteUsers = new RBAC([anyRole]);

    const outputWithoutPermission = aclDeleteUsers.canAccess(
      anyUser,
      '/users/123',
      'DELETE',
    );
    anyRole.permissions.push(PERMISSIONS.deleteUsers);
    const outputWithPermission = aclDeleteUsers.canAccess(
      anyUser,
      '/users/123',
      'DELETE',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });

  it('should be able to add permission to update users', async () => {
    const anyRole: Role = { id: 1, name: 'any', permissions: [] };
    const anyUser = { id: 1, name: 'any', roles: [anyRole] };
    const aclUpdateUsers = new RBAC([anyRole]);

    const outputWithoutPermission = aclUpdateUsers.canAccess(
      anyUser,
      '/users/123',
      'PUT',
    );
    anyRole.permissions.push(PERMISSIONS.updateUsers);
    const outputWithPermission = aclUpdateUsers.canAccess(
      anyUser,
      '/users/123',
      'PUT',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });
});
