import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {DatabaseModule} from "./database/database.module";
import {CommonModule} from "./commons/common.module";
import {appConfig} from "./configs/app.config";
import {connectorConfig} from "./configs/connector.config";
import {dbConfig} from "./configs/db.config";
import {logConfig} from "./configs/log.config";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, connectorConfig, dbConfig, logConfig], // 👈 load all configs
      }),
      DatabaseModule,
      CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
