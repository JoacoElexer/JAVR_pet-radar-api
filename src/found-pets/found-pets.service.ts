import { Injectable, Inject } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { Repository } from 'typeorm';
import { LostPet } from 'src/lost-pets/entities/lost-pet.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const FOUND_PETS_CACHE_KEY = 'found_pets_all';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,

    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    private readonly notificationsService: NotificationsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createFoundPetDto: CreateFoundPetDto) {
    const { latitude, longitude, ...rest } = createFoundPetDto;
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    const newFoundPet = this.foundPetRepository.create({
      ...rest,
      location: location as any,
    });
    const savedPet = await this.foundPetRepository.save(newFoundPet);

    // Invalidar caché al crear
    await this.cacheManager.del(FOUND_PETS_CACHE_KEY);

    const matches = await this.lostPetRepository.query(
      `
      SELECT *,
        ST_AsGeoJSON(location)::json AS location,
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
      `,
      [longitude, latitude],
    );

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
            },
          );
          console.log(`Notificacion enviada a: ${match.owner_email}`);
        } catch (error) {
          console.error(
            `Error al enviar el correo ${match.owner_email}:`,
            error,
          );
        }
      }
    }

    return {
      message: 'Mascota encontrada registrada con éxito',
      data: savedPet,
      matchesFound: matches.length,
      details: matches,
    };
  }

  async findAll() {
    // Intentar desde caché
    const cached = await this.cacheManager.get<FoundPet[]>(FOUND_PETS_CACHE_KEY);
    if (cached) {
      return {
        source: 'cache',
        data: cached,
      };
    }

    // Consultar DB
    const pets = await this.foundPetRepository.find({
      order: { created_at: 'DESC' },
    });

    // Guardar en caché
    await this.cacheManager.set(FOUND_PETS_CACHE_KEY, pets);

    return {
      source: 'database',
      data: pets,
    };
  }

  async findOne(id: number) {
    const pet = await this.foundPetRepository.findOne({ where: { id } });
    if (!pet) {
      return { message: `No se encontró mascota con id ${id}` };
    }
    return pet;
  }

  async update(id: number, updateFoundPetDto: UpdateFoundPetDto) {
    await this.foundPetRepository.update(id, updateFoundPetDto);
    await this.cacheManager.del(FOUND_PETS_CACHE_KEY);
    return { message: `Mascota encontrada #${id} actualizada` };
  }

  async remove(id: number) {
    await this.foundPetRepository.delete(id);
    await this.cacheManager.del(FOUND_PETS_CACHE_KEY);
    return { message: `Mascota encontrada #${id} eliminada` };
  }
}