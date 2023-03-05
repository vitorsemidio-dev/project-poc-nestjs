import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonRepository } from './repositories/pokemon.repository';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: PokemonRepository,
  ) {}

  async create(input: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonRepository.save(input);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonRepository.find();
  }

  async findOne(id: number): Promise<Pokemon> {
    return this.pokemonRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, input: UpdatePokemonDto): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    });
    return await this.pokemonRepository.save({
      ...pokemon,
      ...input,
    });
  }

  async remove(id: number): Promise<void> {
    await this.pokemonRepository.delete(id);
  }

  async saveAvatar(id: number, avatarPath: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    });
    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }
    return await this.pokemonRepository.save({
      ...pokemon,
      avatar: avatarPath,
    });
  }
}
