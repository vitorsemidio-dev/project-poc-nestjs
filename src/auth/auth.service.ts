import { Injectable } from '@nestjs/common';
import { CredentialsDto } from './credentials.dto';

@Injectable()
export class AuthService {
  async login(credentials: CredentialsDto) {
    const { login, password } = credentials;
    return {
      token: 'fake-jwt-token',
    };
  }
}
