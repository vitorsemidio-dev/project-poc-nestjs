import { faker } from '../libs/generate-random-data';
import { CreatePokemonDto } from '../../src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from '../../src/pokemon/entities/pokemon.entity';

export const pokemonFactory = (): {
  pokemon: Pokemon;
  createPokemonDto: CreatePokemonDto;
} => {
  const pokemon = new Pokemon();
  pokemon.id = faker.datatype.number();
  pokemon.name = faker.name.firstName();
  pokemon.type = faker.random.word();

  const createPokemonDto = new CreatePokemonDto();
  createPokemonDto.name = faker.name.firstName();
  createPokemonDto.type = faker.random.word();

  return { pokemon, createPokemonDto };
};
