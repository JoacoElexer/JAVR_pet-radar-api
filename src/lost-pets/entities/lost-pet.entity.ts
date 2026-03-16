import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('Lost_pets')
export class LostPet {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    species: string;
    @Column()
    breed: string
    @Column()
    color: string;
    @Column()
    size: string;
    @Column('text')
    description: string;
    @Column({ nullable: true })
    photo_url: string;
    @Column()
    owner_name: string;
    @Column()
    owner_email: string;
    @Column()
    owner_phone: string;
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: any;
    @Column()
    address: string;
    @Column()
    lost_date: Date;
    @Column({ default: true })
    is_active: boolean;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}