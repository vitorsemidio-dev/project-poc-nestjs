import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from 'src/auth/credentials.dto';
import { Role } from 'src/roles/entities/role.entity';
import { RoleRepository } from 'src/roles/repositories/roles.repository';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';
import { In } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    @InjectRepository(Role)
    private roleRepository: RoleRepository,
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

  async updateRoles(userId: number, rolesId: number[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const roles = await this.roleRepository.findBy({
      id: In(rolesId),
    });
    user.roles = roles;
    return this.userRepository.save(user);
  }
}
