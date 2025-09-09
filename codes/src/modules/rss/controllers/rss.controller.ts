// src/modules/rss/controllers/rss.controller.ts
import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RssService } from '../services/rss.service';

@Controller('rss')
export class RssController {
    constructor(private readonly rssService: RssService) {}

    @Get()
    async getAllFeeds() {
        return this.rssService.getAllFeeds();
    }

    @Get('recent')
    async getRecentFeeds(@Query('limit') limitStr?: string) {
        const limit = limitStr ? parseInt(limitStr, 10) : 10;
        return this.rssService.getRecentFeeds(limit);
    }

    @Get('statistics')
    async getStatistics() {
        return this.rssService.getFeedStatistics();
    }

    @Get('sources')
    async getUniqueSources() {
        return this.rssService.getUniqueSources();
    }

    @Get('search')
    async searchFeeds(
        @Query('q') searchTerm: string,
        @Query('page') pageStr?: string,
    ) {
        if (!searchTerm) {
            return { error: 'Search term is required' };
        }
        const page = pageStr ? parseInt(pageStr, 10) : 1;
        return this.rssService.searchFeeds(searchTerm, page);
    }

    @Get(':id')
    async getFeedById(@Param('id', ParseIntPipe) id: number) {
        return this.rssService.getFeedById(id);
    }

    @Post()
    async createFeed(@Body() feedData: {
        title: string;
        link: string;
        pub_date: string;
        source: string;
        description?: string;
        category?: string;
    }) {
        return this.rssService.createFeed({
            ...feedData,
            pub_date: new Date(feedData.pub_date),
        });
    }
}