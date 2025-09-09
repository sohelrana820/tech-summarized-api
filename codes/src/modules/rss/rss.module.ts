import { Module } from '@nestjs/common';
import { RssService } from './services/rss.service';
import { RssController } from './controllers/rss.controller';

@Module({
    providers: [RssService],
    controllers: [RssController],
    exports: [RssService],
})
export class RssModule {}