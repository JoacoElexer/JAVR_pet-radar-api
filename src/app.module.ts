import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationsService } from './notifications/notifications.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(config.get<string>('REDIS_URL', 'redis://localhost:6379')),
        ],
        ttl: 60_000,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'admin'),
        password: config.get('DB_PASS', 'root'),
        database: config.get('DB_NAME', 'petradar_db'),
        autoLoadEntities: true,
        synchronize: false, // usando migrations
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: config.get('ETHEREAL_USER'),
            pass: config.get('ETHEREAL_PASS'),
          },
        },
        defaults: {
          from: '"PetRadar" <noreply@petradar.com>',
        },
      }),
      inject: [ConfigService],
    }),
    LostPetsModule,
    FoundPetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsService, TelemetryService],
})
export class AppModule {}