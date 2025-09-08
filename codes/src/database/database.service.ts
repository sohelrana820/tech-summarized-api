import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { DbConfigType } from '../configs/config.types';
import { LoggerService } from '../libs/logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor(
    private readonly dbConfigService: ConfigService<DbConfigType>,
    private readonly logger: LoggerService,
  ) {
    const databaseUrl = this.dbConfigService.getOrThrow('databaseUrl');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    this.prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
      log: [{ emit: 'event', level: 'query' }],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.prisma.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }

  /**
   * Executes a database operation using the Prisma client.
   * @param callback A function that receives the PrismaClient and returns a Promise.
   * @param logQueries Optional flag: if true, query logging is enabled for the duration of the operation.
   */
  async execute<T>(
    callback: (client: PrismaClient) => Promise<T>,
    logQueries: boolean = false,
  ): Promise<T> {
    let listener: (e: Prisma.QueryEvent) => void;

    if (logQueries) {
      listener = (e) => {
        this.logger.debug('database', 'Query executed', e);
      };

      (this.prisma as any).$on('query', listener);
    }

    try {
      return await callback(this.prisma);
    } catch (error) {
      this.logger.error('database', 'Database operation failed', error);
      throw error;
    }
  }

  /**
   * Executes a series of database operations within a transaction.
   * @param callback A function that receives the PrismaClient and returns a Promise.
   */
  async executeTransaction<T>(
    callback: (client: PrismaClient) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(callback);
    } catch (error) {
      this.logger.error('database', 'Databse transaction failed', error);
      throw error;
    }
  }

  /**
   * Returns the underlying Prisma client directly.
   */
  getClient(): PrismaClient {
    return this.prisma;
  }
}
