import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ProfilesModule],
})
export class AppModule {}
