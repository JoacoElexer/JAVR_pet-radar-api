import { Injectable } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { UpdateLostPetDto } from './dto/update-lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

  async create(createLostPetDto: CreateLostPetDto) {
    const { latitude, longitude, ...rest } = createLostPetDto;
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
    const newLostPet = this.lostPetRepository.create({
      ...rest,
      location: location as any,
    })
    const savedPet = await this.lostPetRepository.save(newLostPet);
    return {
      message: 'Mascota perdida registrada con éxito',
      pet: savedPet,
    }
  }

  findAll() {
    return `This action returns all lostPets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lostPet`;
  }

  update(id: number, updateLostPetDto: UpdateLostPetDto) {
    return `This action updates a #${id} lostPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} lostPet`;
  }
}
