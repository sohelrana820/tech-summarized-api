import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DatabaseModule} from './database';
import {RssModule} from './modules/rss/rss.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'local_mysql_3308',
            port: 3306,
            username: 'root',
            password: 'secret',
            database: 'tech_summarized',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV === 'development',
        }),
        DatabaseModule,
        RssModule,
    ],
})
export class AppModule {
}