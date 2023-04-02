import { JwtModuleOptions } from '@nestjs/jwt';

export const jtwConfig: JwtModuleOptions = {
  global: true,
  secret: 'secret',
  signOptions: { expiresIn: '10m' },
};
