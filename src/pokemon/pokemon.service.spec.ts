import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonRepository } from './repositories/pokemon.repository';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: PokemonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useClass: PokemonRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    repository = module.get<PokemonRepository>(getRepositoryToken(Pokemon));
  });

  describe('create', () => {
    it('should create a new pokemon', async () => {
      const input: CreatePokemonDto = {
        name: 'Pikachu',
        type: 'Electric',
      };

      const expectedPokemon: Pokemon = {
        id: 1,
        name: 'Pikachu',
        type: 'Electric',
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(expectedPokemon);

      const result = await service.create(input);

      expect(repository.save).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedPokemon);
    });
  });

  describe('findAll', () => {
    it('should return an array of pokemons', async () => {
      const expectedPokemons: Pokemon[] = [
        {
          id: 1,
          name: 'Pikachu',
          type: 'Electric',
        },
        {
          id: 2,
          name: 'Charizard',
          type: 'Fire/Flying',
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(expectedPokemons);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedPokemons);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      const expectedPokemon: Pokemon = {
        id: 1,
        name: 'Pikachu',
        type: 'Electric',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(expectedPokemon);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(expectedPokemon);
    });
  });

  describe('update', () => {
    it('should return updated pokemon', async () => {
      const pokemon = new Pokemon();
      pokemon.id = 1;
      pokemon.name = 'Pikachu';
      pokemon.type = 'Electric';

      const input: UpdatePokemonDto = {
        name: 'Charmander',
        type: 'Fire',
      };

      const updatedPokemon = new Pokemon();
      updatedPokemon.id = 1;
      updatedPokemon.name = 'Charmander';
      updatedPokemon.type = 'Fire';

      jest.spyOn(repository, 'findOne').mockResolvedValue(pokemon);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedPokemon);

      const result = await service.update(1, input);
      expect(result).toEqual(updatedPokemon);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...pokemon,
        ...input,
      });
    });
  });

  describe('remove', () => {
    it('should delete pokemon', async () => {
      const pokemon = new Pokemon();
      pokemon.id = 1;
      pokemon.name = 'Pikachu';
      pokemon.type = 'Electric';

      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValue(pokemon);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
