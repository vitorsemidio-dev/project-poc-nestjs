import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CredentialsDto } from 'src/auth/credentials.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/roles/enums/roles.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sessions')
  login(@Body() credentials: CredentialsDto) {
    return this.authService.login(credentials);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.profile(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('private')
  privateRoute(@Request() req) {
    return [];
  }

  @Public()
  @UseGuards(AuthGuard)
  @Get('public')
  publicRoute(@Request() req) {
    return [];
  }

  @Patch('roles')
  async updateRoles(@Body() body) {
    const { userId, roles } = body;
    return this.authService.updateRoles(userId, roles);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.POKEMON_TRAINER)
  @Get('roles/pokemon_trainer')
  roles01(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.GYM_LEADER)
  @Get('roles/gym_leader')
  roles02(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.ELITE_FOUR)
  @Get('roles/elite_four')
  roles03(@Request() req) {
    return req.user;
  }
}
