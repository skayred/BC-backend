import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { RolesController } from './roles.controller';
import { BCService } from 'src/bc.service';
import { ConfigModule } from '@nestjs/config';
import { Role } from './role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([Role]),
    ConfigModule,
  ],
  controllers: [ProfilesController, RolesController],
  providers: [ProfilesService, BCService],
})
export class ProfilesModule {}
