import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'petradar_db',
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/src/migrations/*.js'],
});