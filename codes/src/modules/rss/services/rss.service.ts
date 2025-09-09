import { Injectable, NotFoundException } from '@nestjs/common';
import { RssUniqueFeedsRepository, RssUniqueFeeds } from '../../../database';

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

    async createFeed(feedData: {
        title: string;
        link: string;
        pub_date: Date;
        source: string;
        description?: string | null;
        category?: string | null;
    }): Promise<RssUniqueFeeds> {
        const exists = await this.rssRepository.existsByLink(feedData.link);
        if (exists) {
            throw new Error('RSS feed with this link already exists');
        }
        return this.rssRepository.create(feedData);
    }

    async getRecentFeeds(limit: number = 10): Promise<RssUniqueFeeds[]> {
        return this.rssRepository.findRecent(limit);
    }
}