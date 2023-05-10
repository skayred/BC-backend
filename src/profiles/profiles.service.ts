import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';

import { ProfileInput } from './models';
import { Role } from './role.entity';
import { BCService } from '../bc.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    private readonly bcService: BCService,
  ) {}

  async create(profile: ProfileInput): Promise<Profile> {
    const inserted = await this.profilesRepository.save(profile);

    return !!inserted.id ? this.findByID(inserted.id) : null;
  }

  async update(id: number, profile: ProfileInput): Promise<Profile> {
    const candidate = await this.profilesRepository.findOne({ where: { id } });

    if (!candidate) {
      return null;
    }

    candidate.firstName = profile.firstName;
    candidate.lastName = profile.lastName;

    await this.profilesRepository.update(id, candidate);

    return this.findByID(id);
  }

  async updateRoles(
    profileID: number,
    rolesToCreate: string[],
    rolesToDelete: Role[],
  ) {
    !!rolesToDelete &&
      rolesToDelete.length > 0 &&
      (await this.rolesRepository.delete(
        rolesToDelete.map((role: Role) => role.id),
      ));

    const insertCandidates = rolesToCreate.map((externalName: string) => {
      let roleModel = new Role();
      roleModel = {
        ...roleModel,
        externalName,
        name: this.bcService.roleByExternalRole(externalName),
        profileID,
      };

      return roleModel;
    });

    await this.rolesRepository.save(insertCandidates);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.find({ relations: { roles: true } });
  }

  async findByID(id: number): Promise<Profile> {
    return this.profilesRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  async delete(id: number) {
    const profile = await this.profilesRepository.find({ where: { id } });

    return this.profilesRepository.remove(profile);
  }
}
