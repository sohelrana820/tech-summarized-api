// src/modules/rss/services/rss.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { RssUniqueFeedsRepository, RssUniqueFeeds } from '../../../database';
import { IPaginationResult } from '../../../database/interfaces';

@Injectable()
export class RssService {
    constructor(
        private readonly rssRepository: RssUniqueFeedsRepository,
    ) {}

    async getAllFeeds(): Promise<RssUniqueFeeds[]> {
        return this.rssRepository.findAll({
            order: { pub_date: 'DESC' },
        });
    }

    async getFeedById(id: number): Promise<RssUniqueFeeds> {
        const feed = await this.rssRepository.findById(id);
        if (!feed) {
            throw new NotFoundException(`RSS feed with ID ${id} not found`);
        }
        return feed;
    }

    async getFeedsBySource(source: string, page: number = 1, limit: number = 10): Promise<IPaginationResult<RssUniqueFeeds>> {
        return this.rssRepository.findBySource(source, { page, limit });
    }

    async searchFeeds(searchTerm: string, page: number = 1): Promise<IPaginationResult<RssUniqueFeeds>> {
        return this.rssRepository.searchByTitle(searchTerm, { page, limit: 20 });
    }

    async createFeed(feedData: Partial<RssUniqueFeeds>): Promise<RssUniqueFeeds> {
        // Check if feed already exists
        const exists = await this.rssRepository.existsByLink(feedData.link);
        if (exists) {
            throw new Error('RSS feed with this link already exists');
        }

        return this.rssRepository.create(feedData);
    }

    async getRecentFeeds(limit: number = 10): Promise<RssUniqueFeeds[]> {
        return this.rssRepository.findRecent(limit);
    }

    async getFeedStatistics() {
        return this.rssRepository.getStatistics();
    }

    async getUniqueSources(): Promise<string[]> {
        return this.rssRepository.getUniqueSources();
    }

    async bulkImportFeeds(feeds: Partial<RssUniqueFeeds>[]): Promise<void> {
        await this.rssRepository.upsertMany(feeds);
    }
}