import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { jtwConfig } from 'src/configs/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    JwtModule.register(jtwConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
