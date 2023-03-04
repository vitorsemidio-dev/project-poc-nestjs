import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonRepository } from './repositories/pokemon.repository';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(PokemonRepository)
    private pokemonRepository: PokemonRepository,
  ) {}

  async create(pokemon: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonRepository.save(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonRepository.find();
  }

  async findOne(id: number): Promise<Pokemon> {
    return this.pokemonRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, pokemon: UpdatePokemonDto): Promise<void> {
    await this.pokemonRepository.update(id, pokemon);
  }

  async remove(id: number): Promise<void> {
    await this.pokemonRepository.delete(id);
  }
}
