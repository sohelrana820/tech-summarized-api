// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RssUniqueFeeds } from './entities/rss-unique-feeds.entity';
import { RssUniqueFeedsRepository } from './repositories/rss-unique-feeds.repository';

@Global() // Makes this module available globally without importing
@Module({
    imports: [
        TypeOrmModule.forFeature([
            RssUniqueFeeds,
            // Add other entities here as you create them
            // User,
            // Summary,
        ]),
    ],
    providers: [
        RssUniqueFeedsRepository,
        // Add other repositories here as you create them
        // UserRepository,
        // SummaryRepository,
    ],
    exports: [
        RssUniqueFeedsRepository,
        TypeOrmModule, // Export for custom queries if needed
        // Export other repositories here
        // UserRepository,
        // SummaryRepository,
    ],
})
export class DatabaseModule {}