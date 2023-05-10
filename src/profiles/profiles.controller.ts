import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.entity';
import { ProfileInput } from './models';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  find(): Promise<Profile[]> {
    return this.profilesService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: number): Promise<Profile> {
    return this.profilesService.findByID(id);
  }

  @Post()
  async createProfile(@Body() profileCandidate: ProfileInput) {
    try {
      const res = await this.profilesService.create(profileCandidate);

      if (!res) {
        throw new BadRequestException();
      }

      return res;
    } catch (e: any) {
      throw new BadRequestException();
    }
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() profileCandidate: ProfileInput,
  ) {
    try {
      const res = await this.profilesService.update(id, profileCandidate);

      if (!res) {
        throw new BadRequestException();
      }

      return res;
    } catch (e: any) {
      throw new BadRequestException();
    }
  }

  @Delete(':id')
  deleteProfile(@Param('id') id: number) {
    try {
      const res = this.profilesService.delete(id);
      if (!res) {
        throw new BadRequestException();
      }

      return res;
    } catch (e: any) {
      throw new BadRequestException();
    }
  }
}
