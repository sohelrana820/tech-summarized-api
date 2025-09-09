import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: 'mysql' as const,
    host: process.env.DB_HOST || 'local_mysql_3308',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_DATABASE || 'tech_summarized',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
}));