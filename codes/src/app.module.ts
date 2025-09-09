import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {CommonModule} from "./commons/common.module";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'local_mysql_3308',
          port: 3306,
          username: 'root',
          password: 'secret',
          database: 'tech_summarized',
          entities: [],
          synchronize: true,
      }),
      CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
