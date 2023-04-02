import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from 'src/auth/credentials.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(credentials: CredentialsDto) {
    const { login, password } = credentials;
    const user = await this.userRepository.findOne({
      where: { login },
      relations: ['roles'],
    });
    if (!user) {
      throw new UnauthorizedException('login/password does not match');
    }
    if (user.password !== password) {
      throw new UnauthorizedException('login/password does not match');
    }
    const payload = {
      sub: user.id,
      roles: user.roles.map((role) => role.name),
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async profile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
