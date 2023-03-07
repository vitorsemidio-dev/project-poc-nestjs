import {
  acl,
  IRole,
  PERMISSIONS,
  RBAC,
  regularUser,
  RoleFactory,
  user,
} from './acl';

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
  const makeSut = () => {
    const anyRole: IRole = RoleFactory.create({
      id: 1,
      name: 'any',
      permissions: [],
    });
    const anyUser = { id: 1, name: 'any', roles: [anyRole] };
    const acl = new RBAC([anyRole]);
    return { anyRole, anyUser, acl };
  };
  it('should be able to add permission to read users', async () => {
    const { anyRole, anyUser, acl: aclReadUsers } = makeSut();

    const outputWithoutPermission = aclReadUsers.canAccess(
      anyUser,
      '/users',
      'GET',
    );
    anyRole.addPermission(PERMISSIONS.readUsers);
    const outputWithPermission = aclReadUsers.canAccess(
      anyUser,
      '/users',
      'GET',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });

  it('should be able to add permission to delete users', async () => {
    const { anyRole, anyUser, acl: aclDeleteUsers } = makeSut();

    const outputWithoutPermission = aclDeleteUsers.canAccess(
      anyUser,
      '/users/123',
      'DELETE',
    );
    anyRole.addPermission(PERMISSIONS.deleteUsers);
    const outputWithPermission = aclDeleteUsers.canAccess(
      anyUser,
      '/users/123',
      'DELETE',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });

  it('should be able to add permission to update users', async () => {
    const { anyRole, anyUser, acl: aclUpdateUsers } = makeSut();

    const outputWithoutPermission = aclUpdateUsers.canAccess(
      anyUser,
      '/users/123',
      'PUT',
    );
    anyRole.addPermission(PERMISSIONS.updateUsers);
    const outputWithPermission = aclUpdateUsers.canAccess(
      anyUser,
      '/users/123',
      'PUT',
    );

    expect(outputWithoutPermission).toBe(false);
    expect(outputWithPermission).toBe(true);
  });
});
