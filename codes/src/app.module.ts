// FIXED: src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database';
import { RssModule } from './modules/rss/rss.module';
import databaseConfig from './configs/database.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = configService.get('database');
                if (!dbConfig) {
                    throw new Error('Database configuration not found');
                }
                return dbConfig;
            },
        }),

        DatabaseModule,
        RssModule,
    ],
})
export class AppModule {}