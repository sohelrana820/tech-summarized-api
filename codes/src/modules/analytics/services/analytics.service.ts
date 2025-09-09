// src/modules/analytics/services/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { RssUniqueFeedsRepository } from '../../../database';

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly rssRepository: RssUniqueFeedsRepository,
    ) {}

    async getDashboardAnalytics() {
        const [
            statistics,
            countBySource,
            countByCategory,
            todaysFeeds,
        ] = await Promise.all([
            this.rssRepository.getStatistics(),
            this.rssRepository.getCountBySource(),
            this.rssRepository.getCountByCategory(),
            this.rssRepository.findTodaysFeeds(),
        ]);

        return {
            overview: statistics,
            sourceDistribution: countBySource,
            categoryDistribution: countByCategory,
            todayActivity: {
                count: todaysFeeds.length,
                feeds: todaysFeeds.slice(0, 5), // Latest 5 feeds
            },
            trends: await this.getWeeklyTrends(),
        };
    }

    private async getWeeklyTrends() {
        const trends = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await this.rssRepository.count({
                pub_date: Between(date, nextDate),
            });

            trends.push({
                date: date.toISOString().split('T')[0],
                count,
            });
        }

        return trends;
    }
}