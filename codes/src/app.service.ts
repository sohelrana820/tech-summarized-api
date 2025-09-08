import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import {RssUniqueFeedsRepository} from "./commons/repositories/rss-unique-feeds.repository";

@Injectable()
export class AppService {

  constructor(
      private readonly rssUniqueFeedsRepository: RssUniqueFeedsRepository,
  ) {
  }
  getHello(): string {
    /*const feeds = this.rssUniqueFeedsRepository.all();*/
    return 'Hello World! server is running';
  }
}
