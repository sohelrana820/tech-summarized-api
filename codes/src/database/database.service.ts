import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {}

    async onModuleInit() {
        if (this.dataSource.isInitialized) {
            this.logger.log('Database connection established successfully');
            this.logger.log(`Database: ${this.dataSource.options.database}`);

            // Type-safe access to MySQL options
            const mysqlOptions = this.dataSource.options as MysqlConnectionOptions;
            this.logger.log(`Host: ${mysqlOptions.host}`);
        }
    }

    async onModuleDestroy() {
        if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.logger.log('Database connection closed');
        }
    }

    // Health check method
    async isHealthy(): Promise<boolean> {
        try {
            await this.dataSource.query('SELECT 1');
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
        const queryRunner = this.dataSource.createQueryRunner();
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

    // Get connection info - fixed type access
    getConnectionInfo() {
        const mysqlOptions = this.dataSource.options as MysqlConnectionOptions;
        return {
            isConnected: this.dataSource.isInitialized,
            database: this.dataSource.options.database,
            host: mysqlOptions.host,
            driver: this.dataSource.options.type,
        };
    }
}