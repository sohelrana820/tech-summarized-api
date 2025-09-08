import { Global, Module } from '@nestjs/common';
import {RssUniqueFeedsRepository} from "./repositories/rss-unique-feeds.repository";
@Global()
@Module({
  imports: [],
  providers: [
    RssUniqueFeedsRepository
  ],
  exports: [
    RssUniqueFeedsRepository
  ],
})
export class CommonModule {}
