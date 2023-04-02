import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RolesEnum } from '../enums/roles.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RolesEnum,
  })
  @IsEnum(RolesEnum)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
