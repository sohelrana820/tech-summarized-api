import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {ConfigModule} from "@nestjs/config";

@Global()
@Module({
  imports: [ConfigModule], // ✅ Makes ConfigService available
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
