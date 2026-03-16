import { Injectable } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { Repository } from 'typeorm';
import { LostPet } from 'src/lost-pets/entities/lost-pet.entity';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,

    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) { }

  async create(createFoundPetDto: CreateFoundPetDto) {
    const { latitude, longitude, ...rest } = createFoundPetDto;
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
    const newFoundPet = this.foundPetRepository.create({
      ...rest,
      location: location as any,
    })
    const savedPet = await this.foundPetRepository.save(newFoundPet);
    const matches = await this.lostPetRepository.query(`
      SELECT *,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance_meters
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          500
        )
          ORDER BY distance_meters ASC;
      `, [longitude, latitude]);
    console.log('Mascota encontrada en: [${longitude}, ${latitude}]');
    console.log('Matches encontrados en un radio de 500m : ${matches.length}');
    return {
      message: 'Mascota encontrada registrada con éxito',
      data: savedPet,
      matchesFound: matches
    }
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
