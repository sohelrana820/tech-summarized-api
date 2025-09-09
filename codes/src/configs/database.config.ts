import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'tech_summarized',

    // Entity configuration
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true, // Automatically load entities

    // Environment-specific settings
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development' ? 'all' : ['error'],

    // Connection pool settings
    extra: {
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
        acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT, 10) || 60000,
        timeout: parseInt(process.env.DB_TIMEOUT, 10) || 60000,
        charset: 'utf8mb4_unicode_ci',
    },

    // Migration settings
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: process.env.NODE_ENV === 'production',

    // Retry connection attempts
    retryAttempts: 3,
    retryDelay: 3000,
}));