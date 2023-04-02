import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CredentialsDto } from './credentials.dto';

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
}
