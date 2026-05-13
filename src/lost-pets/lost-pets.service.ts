import { Injectable, Inject } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { UpdateLostPetDto } from './dto/update-lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const LOST_PETS_CACHE_KEY = 'lost_pets_active';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) { }

  async create(createLostPetDto: CreateLostPetDto) {
    const { latitude, longitude, ...rest } = createLostPetDto;
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    const newLostPet = this.lostPetRepository.create({
      ...rest,
      location: location as any,
    });
    const savedPet = await this.lostPetRepository.save(newLostPet);

    // Invalidar caché al crear una nueva mascota perdida
    await this.cacheManager.del(LOST_PETS_CACHE_KEY);

    return {
      message: 'Mascota perdida registrada con éxito',
      pet: savedPet,
    };
  }

  async findAll() {
    // Intentar obtener desde caché
    const cached = await this.cacheManager.get<LostPet[]>(LOST_PETS_CACHE_KEY);
    if (cached) {
      return {
        source: 'cache',
        data: cached,
      };
    }

    // Si no hay caché, consultar DB
    const pets = await this.lostPetRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });

    // Guardar en caché
    await this.cacheManager.set(LOST_PETS_CACHE_KEY, pets);

    return {
      source: 'database',
      data: pets,
    };
  }

  async findOne(id: number) {
    const pet = await this.lostPetRepository.findOne({ where: { id } });
    if (!pet) {
      return { message: `No se encontró mascota con id ${id}` };
    }
    return pet;
  }

  async update(id: number, updateLostPetDto: UpdateLostPetDto) {
    await this.lostPetRepository.update(id, updateLostPetDto);
    // Invalidar caché al actualizar
    await this.cacheManager.del(LOST_PETS_CACHE_KEY);
    return { message: `Mascota #${id} actualizada` };
  }

  async remove(id: number) {
    await this.lostPetRepository.delete(id);
    // Invalidar caché al eliminar
    await this.cacheManager.del(LOST_PETS_CACHE_KEY);
    return { message: `Mascota #${id} eliminada` };
  }
}