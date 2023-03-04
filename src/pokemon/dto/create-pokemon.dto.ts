import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999)
  height: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(999)
  weight: number;
}
