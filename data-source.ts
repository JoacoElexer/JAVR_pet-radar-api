import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'root',
    database: 'petradar_db',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
});