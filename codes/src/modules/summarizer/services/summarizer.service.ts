// src/modules/summarizer/services/summarizer.service.ts
import { Injectable } from '@nestjs/common';
import { RssUniqueFeedsRepository } from '../../../database';

@Injectable()
export class SummarizerService {
    constructor(
        private readonly rssRepository: RssUniqueFeedsRepository,
    ) {}

    async summarizeFeed(feedId: number): Promise<any> {
        // Get the RSS feed
        const feed = await this.rssRepository.findById(feedId);
        if (!feed) {
            throw new Error('Feed not found');
        }

        // Here you would implement your summarization logic
        // For example, using OpenAI, Google AI, or other AI service
        const summary = await this.generateSummary(feed.description || feed.title);

        return {
            feedId: feed.id,
            originalTitle: feed.title,
            summary: summary,
            source: feed.source,
            publishedAt: feed.pub_date,
        };
    }

    async summarizeRecentFeeds(limit: number = 10): Promise<any[]> {
        const recentFeeds = await this.rssRepository.findRecent(limit);
        const summaries = [];

        for (const feed of recentFeeds) {
            const summary = await this.summarizeFeed(feed.id);
            summaries.push(summary);
        }

        return summaries;
    }

    private async generateSummary(content: string): Promise<string> {
        // Implement your AI summarization logic here
        // This is just a placeholder
        return `Summary of: ${content.substring(0, 100)}...`;
    }
}