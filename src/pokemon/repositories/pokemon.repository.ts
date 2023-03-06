import { EntityRepository, Repository } from 'typeorm';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@EntityRepository(Pokemon)
export class PokemonRepository extends Repository<Pokemon> {}
