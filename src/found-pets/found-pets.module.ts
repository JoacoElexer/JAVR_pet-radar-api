import { Module } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet])],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}
