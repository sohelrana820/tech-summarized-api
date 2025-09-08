import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { dbConfig } from '../configs/db.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;

  constructor(
      @Inject(dbConfig.KEY)
      private readonly dbConf: ConfigType<typeof dbConfig>, // ✅ type-only
  ) {
    const databaseUrl = dbConf.url;
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

  async execute<T>(
      callback: (client: PrismaClient) => Promise<T>,
      logQueries = false,
  ): Promise<T> {
    let listener: (e: Prisma.QueryEvent) => void;

    if (logQueries) {
      listener = (e) => {
        // this.logger.debug('database', 'Query executed', e);
      };
      (this.prisma as any).$on('query', listener);
    }

    try {
      return await callback(this.prisma);
    } catch (error) {
      // this.logger.error('database', 'Database operation failed', error);
      throw error;
    }
  }

  async executeTransaction<T>(
      callback: (client: PrismaClient) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(callback);
    } catch (error) {
      // this.logger.error('database', 'Database transaction failed', error);
      throw error;
    }
  }

  getClient(): PrismaClient {
    return this.prisma;
  }
}
