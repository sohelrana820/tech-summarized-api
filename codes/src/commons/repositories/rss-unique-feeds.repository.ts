import { Injectable } from '@nestjs/common';
/*import { RssUniqueFeeds } from '@prisma/client';*/
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RssUniqueFeedsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /*async all(): Promise<[] | null> {
    /!*return await this.databaseService.execute(async (client) =>
      client.RssUniqueFeeds.findMany(),
    );*!/
  }*/
}
