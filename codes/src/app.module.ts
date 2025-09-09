import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database';
import { RssModule } from './modules/rss/rss.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_DATABASE || 'tech_summarized',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV === 'development', // Fixed: boolean instead of string
        }),
        DatabaseModule,
        RssModule,
    ],
})
export class AppModule {}