import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { RssModule } from './modules/rss/rss.module';
import databaseConfig from './configs/database.config';

@Module({
    imports: [
        // Global configuration
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
            envFilePath: ['.env.local', '.env'],
            cache: true, // Cache configuration for performance
        }),

        // Database module handles all DB connections
        DatabaseModule,

        // Feature modules
        RssModule,
    ],
})
export class AppModule {}