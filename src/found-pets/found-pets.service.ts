import { Injectable } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';

@Injectable()
export class FoundPetsService {
  create(createFoundPetDto: CreateFoundPetDto) {
    return 'This action adds a new foundPet';
  }

  findAll() {
    return `This action returns all foundPets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foundPet`;
  }

  update(id: number, updateFoundPetDto: UpdateFoundPetDto) {
    return `This action updates a #${id} foundPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} foundPet`;
  }
}
