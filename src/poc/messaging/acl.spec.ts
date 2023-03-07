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

describe('ACL - removing permissions to roles', () => {
  const makeSut = () => {
    const roleWithPermissions: IRole = RoleFactory.create({
      id: 1,
      name: 'any',
      permissions: [
        PERMISSIONS.readUsers,
        PERMISSIONS.deleteUsers,
        PERMISSIONS.updateUsers,
      ],
    });
    const userWithRoles = { id: 1, name: 'any', roles: [roleWithPermissions] };
    const aclWithPermissions = new RBAC([roleWithPermissions]);
    return {
      roleWithPermissions,
      userWithRoles,
      aclWithPermissions,
    };
  };
  it('should be able to remove "read users" permission from role', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    const outputBefore = aclWithPermissions.canAccess(
      userWithRoles,
      '/users',
      'GET',
    );
    roleWithPermissions.removePermission(PERMISSIONS.readUsers);
    const outputAfter = aclWithPermissions.canAccess(
      userWithRoles,
      '/users',
      'GET',
    );

    expect(outputBefore).toBe(true);
    expect(outputAfter).toBe(false);
  });

  it('should be able to remove "delete users" permission from role', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    const outputBefore = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'DELETE',
    );
    roleWithPermissions.removePermission(PERMISSIONS.deleteUsers);
    const outputAfter = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'DELETE',
    );

    expect(outputBefore).toBe(true);
    expect(outputAfter).toBe(false);
  });

  it('should be able to remove "update users" permission from role', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    const outputBefore = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );
    roleWithPermissions.removePermission(PERMISSIONS.updateUsers);
    const outputAfter = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );

    expect(outputBefore).toBe(true);
    expect(outputAfter).toBe(false);
  });

  it('should be able to remove all permissions from role one by one', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    roleWithPermissions.removePermission(PERMISSIONS.updateUsers);
    roleWithPermissions.removePermission(PERMISSIONS.readUsers);
    roleWithPermissions.removePermission(PERMISSIONS.deleteUsers);
    const outputWithoutUpdatePermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );
    const outputWithoutDeletePermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );
    const outputWithoutReadPermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );

    expect(outputWithoutUpdatePermission).toBe(false);
    expect(outputWithoutDeletePermission).toBe(false);
    expect(outputWithoutReadPermission).toBe(false);
    expect(roleWithPermissions.permissions.length).toBe(0);
  });

  it('should be able to remove all permissions from role at same time', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    roleWithPermissions.cleanPermissions();
    const outputWithoutUpdatePermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );
    const outputWithoutDeletePermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );
    const outputWithoutReadPermission = aclWithPermissions.canAccess(
      userWithRoles,
      '/users/123',
      'PUT',
    );

    expect(outputWithoutUpdatePermission).toBe(false);
    expect(outputWithoutDeletePermission).toBe(false);
    expect(outputWithoutReadPermission).toBe(false);
    expect(roleWithPermissions.permissions.length).toBe(0);
  });

  it('should not throw when try remove inexistent permission ', async () => {
    const { roleWithPermissions, userWithRoles, aclWithPermissions } =
      makeSut();

    const outputBeforeRemoveReadDashboardPermission =
      aclWithPermissions.canAccess(userWithRoles, '/dashboard', 'GET');
    roleWithPermissions.removePermission(PERMISSIONS.readDashboard);
    const outputAfterRemoveReadDashboardPermission =
      aclWithPermissions.canAccess(userWithRoles, '/dashboard', 'GET');

    expect(outputBeforeRemoveReadDashboardPermission).toBe(false);
    expect(outputAfterRemoveReadDashboardPermission).toBe(false);
  });
});
