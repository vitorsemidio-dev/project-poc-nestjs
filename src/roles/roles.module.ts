import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleRepository } from './repositories/roles.repository';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository, Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
