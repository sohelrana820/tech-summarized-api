import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './../configs/database.config';
import { DatabaseService } from './database.service';
import { RssUniqueFeeds } from './entities';
import { RssUniqueFeedsRepository } from './repositories';

@Global()
@Module({
    imports: [
        // Load database configuration
        ConfigModule.forFeature(databaseConfig),

        // TypeORM setup
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = configService.get('database');

                // Add connection event listeners
                return {
                    ...dbConfig,
                    // Connection event handling
                    extra: {
                        ...dbConfig.extra,
                        // MySQL specific optimizations
                        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                    },
                };
            },
        }),

        // Register entities
        TypeOrmModule.forFeature([RssUniqueFeeds]),
    ],
    providers: [
        DatabaseService,
        RssUniqueFeedsRepository,
    ],
    exports: [
        DatabaseService,
        RssUniqueFeedsRepository,
        TypeOrmModule,
    ],
})
export class DatabaseModule {}