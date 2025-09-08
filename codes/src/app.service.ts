import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {

  constructor() {

  }
  getHello(): string {
    console.log(process.env.DATABASE_URL)
    return 'Hello World! server is running'
  }
}
