import { Module } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { LostPet } from 'src/lost-pets/entities/lost-pet.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { TelemetryService } from 'src/telemetry.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet, LostPet])],
  controllers: [FoundPetsController],
  providers: [FoundPetsService, NotificationsService, TelemetryService],
})
export class FoundPetsModule {}
