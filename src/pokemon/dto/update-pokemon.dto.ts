import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
