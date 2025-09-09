// src/database/repositories/base.repository.ts
import { Repository, FindManyOptions, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { IBaseRepository } from '../interfaces/repository.interface';
import { IPaginationResult, IPaginationOptions } from '../interfaces/pagination.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    constructor(protected readonly repository: Repository<T>) {}

    /**
     * Find all records with optional conditions
     */
    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    /**
     * Find a record by ID
     */
    async findById(id: number): Promise<T | null> {
        return this.repository.findOne({ where: { id } as any });
    }

    /**
     * Create a new record
     */
    async create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    /**
     * Create multiple records
     */
    async createMany(data: Partial<T>[]): Promise<T[]> {
        const entities = this.repository.create(data);
        return this.repository.save(entities);
    }

    /**
     * Update a record by ID
     */
    async update(id: number, data: Partial<T>): Promise<T | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    /**
     * Delete a record by ID
     */
    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Count records with optional conditions
     */
    async count(where?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where });
    }

    /**
     * Check if record exists with given conditions
     */
    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repository.count({ where });
        return count > 0;
    }

    /**
     * Generic pagination method
     */
    async findWithPagination(
        where?: FindOptionsWhere<T>,
        options: IPaginationOptions = {}
    ): Promise<IPaginationResult<T>> {
        const { page = 1, limit = 10, sortBy, sortOrder = 'DESC' } = options;

        // Build order object
        const order: FindOptionsOrder<T> = sortBy
            ? { [sortBy]: sortOrder } as FindOptionsOrder<T>
            : {};

        const [data, total] = await this.repository.findAndCount({
            where,
            order,
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
        };
    }

    /**
     * Soft delete (if your entity has deleted_at field)
     */
    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }

    /**
     * Restore soft deleted record
     */
    async restore(id: number): Promise<void> {
        await this.repository.restore(id);
    }

    /**
     * Find records with relations
     */
    async findWithRelations(relations: string[]): Promise<T[]> {
        return this.repository.find({ relations });
    }

    /**
     * Bulk delete by conditions
     */
    async bulkDelete(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.delete(where);
    }

    /**
     * Raw query execution
     */
    async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
        return this.repository.query(query, parameters);
    }
}