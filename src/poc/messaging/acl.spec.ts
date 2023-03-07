import { user, acl } from './acl';

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
