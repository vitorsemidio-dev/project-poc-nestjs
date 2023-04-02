import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as supertest from 'supertest';

const makeUser = () => ({
  name: 'any_user',
  login: 'any_user',
  password: 'any_user',
});

const makeCredentials = () => ({
  login: 'any_user',
  password: 'any_user',
});

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    request = supertest(app.getHttpServer());
  });

  it('should return a token', async () => {
    const user = makeUser();
    const credentials = {
      login: user.login,
      password: user.password,
    };
    await request.post('/users').send(user).expect(201);

    const response = await request.post('/auth/sessions').send(credentials);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should return a user profile', async () => {
    const user = makeUser();
    const credentials = makeCredentials();
    await request.post('/users').send(user).expect(201);
    const {
      body: { token },
    } = await request.post('/auth/sessions').send(credentials);

    const response = await request
      .get('/auth/profile')
      .set('authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: user.name,
        login: user.login,
        roles: expect.any(Array),
      }),
    );
  });

  it('should return a 401 when the token is invalid', async () => {
    const response = await request
      .get('/auth/profile')
      .set('authorization', `Bearer invalid_token`);

    expect(response.statusCode).toEqual(401);
  });

  it('should return a 401 when the token is missing', async () => {
    const response = await request.get('/auth/profile');

    expect(response.statusCode).toEqual(401);
  });

  it('should access public route with authenticate', async () => {
    const response = await request.get('/auth/public');

    expect(response.statusCode).toEqual(200);
  });

  it('should return 401 when call private route without authenticate', async () => {
    const response = await request.get('/auth/private');

    expect(response.statusCode).toEqual(401);
  });

  it('should access private route with authenticate', async () => {
    const user = makeUser();
    const credentials = makeCredentials();
    await request.post('/users').send(user).expect(201);
    const {
      body: { token },
    } = await request.post('/auth/sessions').send(credentials).expect(201);

    const response = await request
      .get('/auth/private')
      .set('authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
  });
});
