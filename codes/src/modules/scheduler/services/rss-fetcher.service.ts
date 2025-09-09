import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RssUniqueFeedsRepository, RssUniqueFeeds } from '../../../database';

const Parser = require('rss-parser');

@Injectable()
export class RssFetcherService {
    private readonly logger = new Logger(RssFetcherService.name);
    private readonly parser = new Parser();

    constructor(
        private readonly rssRepository: RssUniqueFeedsRepository,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async fetchAllRssFeeds() {
        this.logger.log('Starting RSS feed fetch job');

        const sources = [
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
            { name: 'Hacker News', url: 'https://feeds.feedburner.com/ycombinator' },
            { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
        ];

        for (const source of sources) {
            try {
                await this.fetchFromSource(source.name, source.url);
            } catch (error: any) {
                this.logger.error(`Failed to fetch from ${source.name}:`, error.message);
            }
        }

        this.logger.log('RSS feed fetch job completed');
    }

    private async fetchFromSource(sourceName: string, url: string) {
        try {
            const feed = await this.parser.parseURL(url);
            const feedsToInsert: Partial<RssUniqueFeeds>[] = [];

            for (const item of feed.items) {
                if (item.link) {
                    const exists = await this.rssRepository.existsByLink(item.link);
                    if (!exists) {
                        feedsToInsert.push({
                            title: item.title?.substring(0, 500) || '',
                            link: item.link || '',
                            pub_date: new Date(item.pubDate || new Date()),
                            source: sourceName,
                            description: item.contentSnippet?.substring(0, 1000) || null,
                            category: item.categories?.join(', ') || null,
                        });
                    }
                }
            }

            if (feedsToInsert.length > 0) {
                await this.rssRepository.createMany(feedsToInsert);
                this.logger.log(`Inserted ${feedsToInsert.length} new feeds from ${sourceName}`);
            }

        } catch (error: any) {
            this.logger.error(`Error fetching from ${sourceName}:`, error.message);
            throw error;
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupOldFeeds() {
        this.logger.log('Starting cleanup of old feeds');
        const deletedCount = await this.rssRepository.deleteOldFeeds(30);
        this.logger.log(`Cleaned up ${deletedCount} old feeds`);
    }
}