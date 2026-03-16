import { Injectable } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { Repository } from 'typeorm';
import { LostPet } from 'src/lost-pets/entities/lost-pet.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,

    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    private readonly notificationsService: NotificationsService,
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
        ST_AsGeoJSON(location)::json AS location, -- Convertimos el binario a JSON legible
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
    if (matches.length > 0) {
      for (const match of matches) {
        try {
          await this.notificationsService.sendMatchNotification(
            match.owner_email,
            match.owner_name,
            match.name,
            [longitude, latitude],
            match.location,
            {
              name: rest.finder_name,
              phone: rest.finder_phone,
              email: rest.finder_email,
              description: rest.description,
              species: rest.species,
              breed: rest.breed,
              color: rest.color,
              size: rest.size,
            }
          );
          console.log(`Notificacion enviada a: ${match.owner_email}`);
        } catch (error) {
          console.error(`Error al enviar el correo  ${match.owner_email}:`, error);
        }
      }
    }
    return {
      message: 'Mascota encontrada registrada con éxito',
      data: savedPet,
      matchesFound: matches,
      details: matches
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
