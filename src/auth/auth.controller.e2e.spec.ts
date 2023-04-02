import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as supertest from 'supertest';

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
    const user = {
      name: 'any_user',
      login: 'any_user',
      password: 'any_user',
    };
    const credentials = {
      login: user.login,
      password: user.password,
    };
    await request.post('/users').send(user).expect(201);

    const response = await request.post('/auth/sessions').send(credentials);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('token');
  });
});
