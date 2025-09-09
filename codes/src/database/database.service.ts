import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectConnection()
        private readonly connection: Connection,
    ) {}

    async onModuleInit() {
        if (this.connection.isConnected) {
            this.logger.log('Database connection established successfully');
            this.logger.log(`Database: ${this.connection.options.database}`);
            this.logger.log(`Host: ${this.connection.options.host}`);
        }
    }

    async onModuleDestroy() {
        if (this.connection.isConnected) {
            await this.connection.close();
            this.logger.log('Database connection closed');
        }
    }

    // Health check method
    async isHealthy(): Promise<boolean> {
        try {
            await this.connection.query('SELECT 1');
            return true;
        } catch (error) {
            this.logger.error('Database health check failed:', error);
            return false;
        }
    }

    // Transaction wrapper
    async executeInTransaction<T>(
        operation: (manager: EntityManager) => Promise<T>
    ): Promise<T> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await operation(queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Transaction failed:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // Get connection info
    getConnectionInfo() {
        return {
            isConnected: this.connection.isConnected,
            database: this.connection.options.database,
            host: this.connection.options.host,
            driver: this.connection.options.type,
        };
    }
}