import {FindManyOptions, FindOptionsWhere, ObjectLiteral} from 'typeorm';
import {IPaginationResult, IPaginationOptions} from './pagination.interface';

export interface IBaseRepository<T extends ObjectLiteral> {
    findAll(options?: FindManyOptions<T>): Promise<T[]>;

    findById(id: number): Promise<T | null>;

    create(data: Partial<T>): Promise<T>;

    createMany(data: Partial<T>[]): Promise<T[]>;

    update(id: number, data: Partial<T>): Promise<T | null>;

    delete(id: number): Promise<void>;

    count(where?: FindOptionsWhere<T>): Promise<number>;

    exists(where: FindOptionsWhere<T>): Promise<boolean>;

    findWithPagination(
        where?: FindOptionsWhere<T>,
        options?: IPaginationOptions
    ): Promise<IPaginationResult<T>>;
}