import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ImagemUploadSchema } from './dto/upload-image-pokemon.schema';
import { Pokemon } from './entities/pokemon.entity';
import { uploadMiddleware } from '../middlewares/upload-middleware';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @Post()
  create(@Body() pokemon: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonService.create(pokemon);
  }

  @Get()
  findAll(): Promise<Pokemon[]> {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Pokemon> {
    return this.pokemonService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() pokemon: UpdatePokemonDto,
  ): Promise<Pokemon> {
    return this.pokemonService.update(Number(id), pokemon);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.pokemonService.remove(Number(id));
  }

  @Post(':id/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Corpo da solicitação para upload de imagem.',
    schema: ImagemUploadSchema,
  })
  @UseInterceptors(
    FileInterceptor(
      'imagem',
      uploadMiddleware({
        limits: { fileSize: 5 * 1024 * 1024 },
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
      }),
    ),
  )
  async upload(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const path = file.path;
    return this.pokemonService.saveAvatar(Number(id), path);
  }
}
