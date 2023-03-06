import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { UpdatePokemonDto } from 'src/pokemon/dto/update-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonController } from 'src/pokemon/pokemon.controller';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonRepository } from 'src/pokemon/repositories/pokemon.repository';

const makePokemon = (override: Partial<Pokemon> = {}): Pokemon => {
  return {
    id: 1,
    name: 'Pikachu',
    type: 'Electric',
    avatar: 'pikachu.png',
    ...override,
  };
};

const makePokemonDto = (
  override: Partial<CreatePokemonDto | UpdatePokemonDto> = {},
): CreatePokemonDto => {
  return {
    name: 'Charmander',
    type: 'Fire',
    ...override,
  };
};

const makeFile = (
  override: Partial<Express.Multer.File> = {},
): Express.Multer.File => {
  return {
    fieldname: 'any_fieldname',
    originalname: 'any_originalname.txt',
    encoding: 'any_encoding',
    mimetype: 'any_minetype',
    size: 100,
    stream: new Readable(),
    destination: 'any_destination',
    filename: 'any_filename',
    path: 'any_path',
    buffer: Buffer.from('any_buffer'),
    ...override,
  };
};

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;
  let repository: PokemonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useClass: PokemonRepository,
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
    repository = module.get<PokemonRepository>(getRepositoryToken(Pokemon));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    it('should find pokemon by id', async () => {
      // Arrange
      const pokemon: Pokemon = makePokemon();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pokemon);
      jest.spyOn(service, 'findOne');

      // Act
      const result = await controller.findOne(pokemon.id.toString());

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(pokemon.id);
      expect(result).toEqual(pokemon);
    });

    it('should return undefined when pokemon is not found', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(controller, 'findOne');

      // Act
      const result = await controller.findOne(pokemonIdAsString);

      // Asset
      expect(result).toBeUndefined();
      expect(controller.findOne).toHaveBeenCalledWith(pokemonIdAsString);
    });
  });

  describe('findAll', () => {
    it('should return an array of pokemons', async () => {
      // Arrange
      const pokemons: Pokemon[] = [
        makePokemon(),
        makePokemon({
          id: 2,
          name: 'Charmander',
          type: 'Fire',
          avatar: 'charmander.png',
        }),
      ];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(pokemons);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(pokemons);
      expect(result.length).toEqual(2);
    });
  });

  describe('update', () => {
    it('should call update method with expected param', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      const dto = new UpdatePokemonDto();
      jest.spyOn(service, 'update').mockResolvedValueOnce(pokemon);
      jest.spyOn(controller, 'update');

      // Act
      await controller.update(pokemonIdAsString, dto);

      // Asset
      expect(controller.update).toHaveBeenLastCalledWith(
        pokemonIdAsString,
        dto,
      );
    });

    it('should call update and return expected value', async () => {
      // Arrange
      const pokemon: Pokemon = makePokemon();
      const dto = makePokemonDto();

      jest.spyOn(service, 'update').mockResolvedValueOnce({
        ...pokemon,
        ...dto,
      });

      // Act
      const result = await controller.update(pokemon.id.toString(), dto);

      // Asset
      expect(result).toEqual(
        expect.objectContaining({
          id: pokemon.id,
          name: dto.name,
          type: dto.type,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should call remove with expected params', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      jest.spyOn(controller, 'remove');
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      // Act
      const output = await controller.remove(pokemonIdAsString);

      // Asset
      expect(controller.remove).toHaveBeenCalledWith(pokemonIdAsString);
      expect(service.remove).toHaveBeenCalledWith(pokemon.id);
      expect(output).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should call create with expected params', async () => {
      // Arrange
      const dto = makePokemonDto();
      const pokemon: Pokemon = makePokemon({ ...dto });
      jest.spyOn(service, 'create').mockResolvedValueOnce(pokemon);
      jest.spyOn(controller, 'create');

      // Act
      await controller.create(dto);

      // Asset
      expect(controller.create).toHaveBeenCalledWith(dto);
    });

    it('should call create and return expected value', async () => {
      // Arrange
      const dto = makePokemonDto();
      const pokemon: Pokemon = makePokemon({ ...dto });
      jest.spyOn(service, 'create').mockResolvedValueOnce(pokemon);

      // Act
      const output = await controller.create(dto);

      // Asset
      expect(output).toEqual(
        expect.objectContaining({
          id: pokemon.id,
          name: dto.name,
          type: dto.type,
        }),
      );
    });
  });

  describe('upload', () => {
    it('should call upload with expected params', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      const newAvatarName = 'new-avatar.png';
      const file = makeFile({ path: newAvatarName });
      jest.spyOn(service, 'saveAvatar').mockResolvedValueOnce({
        ...pokemon,
        avatar: newAvatarName,
      });
      jest.spyOn(controller, 'upload');
      jest.spyOn(service, 'saveAvatar');

      // Act
      await controller.upload(pokemonIdAsString, file);

      // Assert
      expect(controller.upload).toHaveBeenCalledWith(pokemonIdAsString, file);
      expect(service.saveAvatar).toHaveBeenCalledWith(pokemon.id, file.path);
    });

    it('should call upload and return expected value', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      const newAvatarName = 'new-avatar.png';
      const file = makeFile({ path: newAvatarName });
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(pokemon);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...pokemon,
        avatar: newAvatarName,
      });

      // Act
      const output = await controller.upload(pokemonIdAsString, file);

      // Asset
      expect(output).toEqual(
        expect.objectContaining({
          ...pokemon,
          avatar: newAvatarName,
        }),
      );
    });

    it('should throw if pokemon not found', async () => {
      // Arrange
      const pokemon = makePokemon();
      const pokemonIdAsString = pokemon.id.toString();
      const newAvatarName = 'new-avatar.png';
      const file = makeFile({ path: newAvatarName });
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      // Act
      const output = () => {
        return controller.upload(pokemonIdAsString, file);
      };

      // Asset
      await expect(output()).rejects.toThrow('Pokemon not found');
    });
  });
});
