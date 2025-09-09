import { Injectable } from '@nestjs/common';
import { RssUniqueFeedsRepository } from '../../../database';

interface FeedSummary {
    feedId: number;
    originalTitle: string;
    summary: string;
    source: string;
    publishedAt: Date;
}

@Injectable()
export class SummarizerService {
    constructor(
        private readonly rssRepository: RssUniqueFeedsRepository,
    ) {}

    async summarizeFeed(feedId: number): Promise<FeedSummary> {
        const feed = await this.rssRepository.findById(feedId);
        if (!feed) {
            throw new Error('Feed not found');
        }

        const summary = await this.generateSummary(feed.description || feed.title);

        return {
            feedId: feed.id,
            originalTitle: feed.title,
            summary: summary,
            source: feed.source,
            publishedAt: feed.pub_date,
        };
    }

    async summarizeRecentFeeds(limit: number = 10): Promise<FeedSummary[]> {
        const recentFeeds = await this.rssRepository.findRecent(limit);
        const summaries: FeedSummary[] = [];

        for (const feed of recentFeeds) {
            const summary = await this.summarizeFeed(feed.id);
            summaries.push(summary);
        }

        return summaries;
    }

    private async generateSummary(content: string): Promise<string> {
        return `Summary of: ${content.substring(0, 100)}...`;
    }
}