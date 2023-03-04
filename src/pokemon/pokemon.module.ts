import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonRepository } from './repositories/pokemon.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, PokemonRepository])],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
