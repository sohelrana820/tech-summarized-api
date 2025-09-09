import {Repository, FindManyOptions, FindOptionsWhere, FindOptionsOrder, ObjectLiteral} from 'typeorm';
import type {IBaseRepository} from '../interfaces';
import type {IPaginationResult, IPaginationOptions} from '../interfaces';

export abstract class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
    constructor(protected readonly repository: Repository<T>) {
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findById(id: number): Promise<T | null> {
        return this.repository.findOne({where: {id} as any});
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = this.repository.create(data as any);
        const savedEntity = await this.repository.save(entity);
        return Array.isArray(savedEntity) ? savedEntity[0] : savedEntity;
    }

    async createMany(data: Partial<T>[]): Promise<T[]> {
        const entities = this.repository.create(data as any);
        return this.repository.save(entities);
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async count(where?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({where});
    }

    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.repository.count({where});
        return count > 0;
    }

    async findWithPagination(
        where?: FindOptionsWhere<T>,
        options: IPaginationOptions = {}
    ): Promise<IPaginationResult<T>> {
        const {page = 1, limit = 10, sortBy, sortOrder = 'DESC'} = options;

        const order: FindOptionsOrder<T> = sortBy
            ? {[sortBy]: sortOrder} as FindOptionsOrder<T>
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

    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }

    async restore(id: number): Promise<void> {
        await this.repository.restore(id);
    }

    async findWithRelations(relations: string[]): Promise<T[]> {
        return this.repository.find({relations});
    }

    async bulkDelete(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.delete(where);
    }

    async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
        return this.repository.query(query, parameters);
    }
}
