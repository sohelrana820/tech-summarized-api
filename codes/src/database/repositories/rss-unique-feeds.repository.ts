import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { RssUniqueFeeds } from '../entities';
import { BaseRepository } from './base.repository';
import { IPaginationResult, IPaginationOptions } from '../interfaces';

@Injectable()
export class RssUniqueFeedsRepository extends BaseRepository<RssUniqueFeeds> {
    constructor(
        @InjectRepository(RssUniqueFeeds)
        repository: Repository<RssUniqueFeeds>,
    ) {
        super(repository);
    }

    /**
     * Find feeds by source with pagination
     */
    async findBySource(
        source: string,
        options: IPaginationOptions = {}
    ): Promise<IPaginationResult<RssUniqueFeeds>> {
        return this.findWithPagination(
            { source },
            { ...options, sortBy: 'pub_date' }
        );
    }

    /**
     * Find feeds by multiple sources
     */
    async findBySources(sources: string[]): Promise<RssUniqueFeeds[]> {
        return this.repository.find({
            where: { source: In(sources) },
            order: { pub_date: 'DESC' },
        });
    }

    /**
     * Find feeds by category
     */
    async findByCategory(category: string): Promise<RssUniqueFeeds[]> {
        return this.repository.find({
            where: { category },
            order: { pub_date: 'DESC' },
        });
    }

    /**
     * Check if feed exists by link
     */
    async existsByLink(link: string): Promise<boolean> {
        return this.exists({ link });
    }

    /**
     * Find feed by link
     */
    async findByLink(link: string): Promise<RssUniqueFeeds | null> {
        return this.repository.findOne({ where: { link } });
    }

    /**
     * Find recent feeds with limit
     */
    async findRecent(limit: number = 10): Promise<RssUniqueFeeds[]> {
        return this.repository.find({
            order: { pub_date: 'DESC' },
            take: limit,
        });
    }

    /**
     * Search feeds by title (case-insensitive)
     */
    async searchByTitle(
        searchTerm: string,
        options: IPaginationOptions = {}
    ): Promise<IPaginationResult<RssUniqueFeeds>> {
        return this.findWithPagination(
            { title: Like(`%${searchTerm}%`) },
            { ...options, sortBy: 'pub_date' }
        );
    }

    /**
     * Search in title and description
     */
    async fullTextSearch(searchTerm: string): Promise<RssUniqueFeeds[]> {
        return this.repository
            .createQueryBuilder('feed')
            .where('feed.title LIKE :searchTerm OR feed.description LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
            })
            .orderBy('feed.pub_date', 'DESC')
            .getMany();
    }

    /**
     * Find feeds by date range
     */
    async findByDateRange(
        startDate: Date,
        endDate: Date,
        options: IPaginationOptions = {}
    ): Promise<IPaginationResult<RssUniqueFeeds>> {
        return this.findWithPagination(
            { pub_date: Between(startDate, endDate) },
            { ...options, sortBy: 'pub_date' }
        );
    }

    /**
     * Find feeds published today
     */
    async findTodaysFeeds(): Promise<RssUniqueFeeds[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.repository.find({
            where: {
                pub_date: Between(today, tomorrow),
            },
            order: { pub_date: 'DESC' },
        });
    }

    /**
     * Get all unique sources
     */
    async getUniqueSources(): Promise<string[]> {
        const result = await this.repository
            .createQueryBuilder('feed')
            .select('DISTINCT feed.source', 'source')
            .orderBy('feed.source', 'ASC')
            .getRawMany();

        return result.map(item => item.source);
    }

    /**
     * Get all unique categories (excluding null values)
     */
    async getUniqueCategories(): Promise<string[]> {
        const result = await this.repository
            .createQueryBuilder('feed')
            .select('DISTINCT feed.category', 'category')
            .where('feed.category IS NOT NULL AND feed.category != ""')
            .orderBy('feed.category', 'ASC')
            .getRawMany();

        return result.map(item => item.category);
    }

    /**
     * Get feeds count by source
     */
    async getCountBySource(): Promise<Array<{ source: string; count: number }>> {
        return this.repository
            .createQueryBuilder('feed')
            .select('feed.source', 'source')
            .addSelect('COUNT(*)', 'count')
            .groupBy('feed.source')
            .orderBy('count', 'DESC')
            .getRawMany();
    }

    /**
     * Get feeds count by category
     */
    async getCountByCategory(): Promise<Array<{ category: string; count: number }>> {
        return this.repository
            .createQueryBuilder('feed')
            .select('feed.category', 'category')
            .addSelect('COUNT(*)', 'count')
            .where('feed.category IS NOT NULL AND feed.category != ""')
            .groupBy('feed.category')
            .orderBy('count', 'DESC')
            .getRawMany();
    }

    /**
     * Get feeds statistics
     */
    async getStatistics(): Promise<{
        totalFeeds: number;
        totalSources: number;
        totalCategories: number;
        feedsToday: number;
        feedsThisWeek: number;
        feedsThisMonth: number;
    }> {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalFeeds,
            uniqueSources,
            uniqueCategories,
            feedsToday,
            feedsThisWeek,
            feedsThisMonth,
        ] = await Promise.all([
            this.count(),
            this.getUniqueSources(),
            this.getUniqueCategories(),
            this.count({ pub_date: Between(today, now) }),
            this.count({ pub_date: Between(weekAgo, now) }),
            this.count({ pub_date: Between(monthAgo, now) }),
        ]);

        return {
            totalFeeds,
            totalSources: uniqueSources.length,
            totalCategories: uniqueCategories.length,
            feedsToday,
            feedsThisWeek,
            feedsThisMonth,
        };
    }

    /**
     * Bulk upsert feeds (insert or update on duplicate)
     */
    async upsertMany(feeds: Partial<RssUniqueFeeds>[]): Promise<void> {
        if (feeds.length === 0) return;

        await this.repository
            .createQueryBuilder()
            .insert()
            .into(RssUniqueFeeds)
            .values(feeds)
            .orUpdate(['title', 'description', 'category', 'pub_date'], ['link'])
            .execute();
    }

    /**
     * Delete old feeds (older than specified days)
     */
    async deleteOldFeeds(daysOld: number): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(RssUniqueFeeds)
            .where('pub_date < :cutoffDate', { cutoffDate })
            .execute();

        return result.affected || 0;
    }

    /**
     * Get popular feeds (most recently published from each source)
     */
    async getPopularFeeds(limit: number = 20): Promise<RssUniqueFeeds[]> {
        return this.repository
            .createQueryBuilder('feed')
            .distinctOn(['feed.source'])
            .orderBy('feed.source')
            .addOrderBy('feed.pub_date', 'DESC')
            .limit(limit)
            .getMany();
    }

    /**
     * Find feeds with empty or null descriptions
     */
    async findWithoutDescription(): Promise<RssUniqueFeeds[]> {
        return this.repository
            .createQueryBuilder('feed')
            .where('feed.description IS NULL OR feed.description = ""')
            .getMany();
    }

    /**
     * Update feed description by ID
     */
    async updateDescription(id: number, description: string): Promise<RssUniqueFeeds | null> {
        await this.repository.update(id, { description });
        return this.findById(id);
    }
}