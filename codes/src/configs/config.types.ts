import { ConfigType } from '@nestjs/config';
import { appConfig } from './app.config';
import { connectorConfig } from './connector.config';
import { dbConfig } from './db.config';
import { logConfig } from './log.config';

export type AppConfigType = ConfigType<typeof appConfig>;
export type ConnectorConfigType = ConfigType<typeof connectorConfig>;
export type DbConfigType = ConfigType<typeof dbConfig>;
export type LogConfigType = ConfigType<typeof logConfig>;
