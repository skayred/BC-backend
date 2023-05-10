import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DBHOST'),
        port: configService.get('DBPORT'),
        username: configService.get('DBUSER'),
        password: configService.get('DBPASSWORD'),
        database: configService.get('DB'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        logging: true,
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
