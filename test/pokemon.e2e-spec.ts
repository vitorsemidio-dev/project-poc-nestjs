import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;
  let id: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new pokemon', async () => {
    const response = await request(app.getHttpServer())
      .post('/pokemon')
      .send({ name: 'Pikachu', type: 'Electric' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Pikachu');
    expect(response.body.type).toBe('Electric');

    id = response.body.id;
  });

  it('should get all pokemons', async () => {
    const response = await request(app.getHttpServer()).get('/pokemon');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a pokemon by id', async () => {
    const response = await request(app.getHttpServer()).get(`/pokemon/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Pikachu');
    expect(response.body.type).toBe('Electric');
  });

  it('should update a pokemon', async () => {
    const response = await request(app.getHttpServer())
      .put(`/pokemon/${id}`)
      .send({ name: 'Raichu' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Raichu');
    expect(response.body.type).toBe('Electric');
  });

  it('should delete a pokemon', async () => {
    const response = await request(app.getHttpServer()).delete(
      `/pokemon/${id}`,
    );

    expect(response.status).toBe(204);
  });

  it('should throw an error when creating a pokemon with invalid data', async () => {
    const invalidDto: CreatePokemonDto = {
      name: '',
      type: '',
    };

    const response = await request(app.getHttpServer())
      .post('/pokemon')
      .send(invalidDto)
      .expect(400);

    expect(response.body.message).toContain('name should not be empty');
    expect(response.body.message).toContain('type should not be empty');
  });
});
