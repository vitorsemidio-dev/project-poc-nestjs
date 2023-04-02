import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import { Role } from 'src/roles/entities/role.entity';
import { RoleRepository } from 'src/roles/repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: RoleRepository,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.save({
      ...updateRoleDto,
      id,
    });
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
