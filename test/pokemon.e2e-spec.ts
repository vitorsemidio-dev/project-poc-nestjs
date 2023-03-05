import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { makeFakeFile } from './helpers/fake-file.factory';

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

  describe('Test upload route', () => {
    it('should accept files smaller than 5 MB', async () => {
      const maxSizeAccept = 5;
      const sizeInMB = maxSizeAccept - 1;
      const filename = `${sizeInMB}_fakefile.png`;
      const { filePath } = await makeFakeFile({
        sizeInMB,
        filename,
      });

      const response = await request(app.getHttpServer())
        .post('/pokemon')
        .send({ name: 'Pikachu', type: 'Electric' })
        .expect(201);

      const res = await request(app.getHttpServer())
        .post(`/pokemon/${response.body.id}/upload`)
        .set('Content-Type', 'multipart/form-data')
        .attach('imagem', filePath);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: response.body.id,
          avatar: expect.any(String),
        }),
      );
    });

    it('should not allow upload no image files', async () => {
      const sizeInMB = 1;
      const filename = `${sizeInMB}_fakefile.txt`;
      const { filePath } = await makeFakeFile({
        sizeInMB,
        filename,
      });
      const pokemonIdNotExists = 1000;

      const res = await request(app.getHttpServer())
        .post(`/pokemon/${pokemonIdNotExists}/upload`)
        .set('Content-Type', 'multipart/form-data')
        .attach('imagem', filePath);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain(
        'Somente arquivos com as seguintes extensões são permitidos',
      );
    });

    it('should not allow upload file if pokemon not exists', async () => {
      const maxSizeAccept = 5;
      const sizeInMB = maxSizeAccept - 1;
      const filename = `${sizeInMB}_fakefile.png`;
      const { filePath } = await makeFakeFile({
        sizeInMB,
        filename,
      });

      const pokemonIdNotExists = 1000;

      const res = await request(app.getHttpServer())
        .post(`/pokemon/${pokemonIdNotExists}/upload`)
        .set('Content-Type', 'multipart/form-data')
        .attach('imagem', filePath);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Pokemon not found');
    });

    it('should reject files larger than 5 MB', async () => {
      const { filePath } = await makeFakeFile({
        sizeInMB: 6,
        filename: 'fakefile.png',
      });
      const requestFile = filePath;

      const res = await request(app.getHttpServer())
        .post('/pokemon/1/upload')
        .set('Content-Type', 'multipart/form-data')
        .attach('imagem', requestFile);

      expect(res.statusCode).toEqual(413);
    });
  });
});
