import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RssUniqueFeeds } from './entities';
import { RssUniqueFeedsRepository } from './repositories';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            RssUniqueFeeds,
        ]),
    ],
    providers: [
        RssUniqueFeedsRepository,
    ],
    exports: [
        RssUniqueFeedsRepository,
        TypeOrmModule,
    ],
})
export class DatabaseModule {}