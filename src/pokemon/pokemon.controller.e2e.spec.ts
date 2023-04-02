import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as supertest from 'supertest';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;
  let request: () => supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    request = () => {
      return supertest(app.getHttpServer());
    };
  });

  it('/pokemon (GET)', async () => {
    const response = await request().get('/pokemon');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('/pokemon (POST)', async () => {
    const response = await request()
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 'Elétrico' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      name: 'Pikachu',
      type: 'Elétrico',
      avatar: null,
    });
  });

  it('/pokemon (POST) - name is required', async () => {
    const response = await request()
      .post('/pokemon')
      .send({ type: 'Elétrico' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.arrayContaining(['name should not be empty']),
      error: 'Bad Request',
    });
  });

  it('/pokemon (POST) - type is required', async () => {
    const response = await request().post('/pokemon').send({ name: 'Pikachu' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.arrayContaining(['type should not be empty']),
      error: 'Bad Request',
    });
  });

  it('/pokemon (POST) - name must be a string', async () => {
    const response = await request()
      .post('/pokemon')
      .send({ name: 123, type: 'Elétrico' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: ['name must be a string'],
      error: 'Bad Request',
    });
  });

  it('/pokemon (POST) - type must be a string', async () => {
    const response = await request()
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 123 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      message: ['type must be a string'],
      error: 'Bad Request',
    });
  });

  it('/pokemon (PUT/:id)', async () => {
    await request()
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 'Elétrico' });

    const response = await request()
      .put('/pokemon/1')
      .send({ name: 'Charmander', type: 'Fogo' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'Charmander',
      type: 'Fogo',
      avatar: null,
    });
  });

  it('/pokemon (GET/:id)', async () => {
    await request()
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 'Elétrico' });

    const response = await request().get('/pokemon/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'Pikachu',
      type: 'Elétrico',
      avatar: null,
    });
  });

  it('/pokemon (DELETE/:id)', async () => {
    await request()
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 'Elétrico' });

    const response = await request().delete('/pokemon/1');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});
