import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Role } from './role.entity';
import { BCService } from '../bc.service';

@Controller('profiles/:id/roles')
export class RolesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly bcService: BCService,
  ) {}

  @Get()
  async find(@Param('id') id: number): Promise<Role[]> {
    const profile = await this.profilesService.findByID(id);

    return !!profile ? profile.roles : [];
  }

  @Put()
  async upsertRoles(@Param('id') id: number, @Body() externalRoles: string[]) {
    // If at least one role is not found in the config - better to stop immediately
    if (
      externalRoles.some(
        (role: string) => !this.bcService.externalRoles().includes(role),
      )
    ) {
      throw new BadRequestException();
    }

    const profile = await this.profilesService.findByID(id);

    if (!profile || !profile.roles) {
      throw new BadRequestException();
    }

    // Those that are not in the profile role list should be created
    const newRoles = externalRoles.filter(
      (extRole: string) =>
        !profile.roles.find((role: Role) => role.externalName === extRole),
    );

    // Those that are in the profile list, but incoming list doesn't have it - staged for deletion
    const rolesToDelete = profile.roles.filter(
      (role: Role) => !externalRoles.includes(role.externalName),
    );

    // Those that are both in the profile list and incoming list - should be kept intact
    const intactRoles = profile.roles.filter((role: Role) =>
      externalRoles.includes(role.externalName),
    );

    this.profilesService.updateRoles(id, newRoles, rolesToDelete);

    return {
      deletedRoles: rolesToDelete.map((role: Role) => role.name),
      addedRoles: newRoles.map((role: string) =>
        this.bcService.roleByExternalRole(role),
      ),
      unchangedRoles: intactRoles.map((role: Role) => role.name),
    };
  }
}
