import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RssUniqueFeeds } from '@prisma/client';

@Injectable()
export class RssUniqueFeedsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async all(): Promise<RssUniqueFeeds[]> {
    return await this.databaseService.execute(client =>
        client.rssUniqueFeeds.findMany(),
    );
  }
}
