// src/modules/rss/rss.module.ts
import { Module } from '@nestjs/common';
import { RssService } from './services/rss.service';
import { RssController } from './controllers/rss.controller';
// No need to import DatabaseModule - it's Global!

@Module({
    providers: [RssService],
    controllers: [RssController],
    exports: [RssService], // Export service for other modules
})
export class RssModule {}