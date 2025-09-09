import {Controller, Get, Post, Body, Param, ParseIntPipe} from '@nestjs/common';
import {RssService} from '../services/rss.service';

@Controller('rss')
export class RssController {
    constructor(private readonly rssService: RssService) {
    }

    @Get()
    async getAllFeeds() {
        return this.rssService.getAllFeeds();
    }

    @Get('recent')
    async getRecentFeeds() {
        return this.rssService.getRecentFeeds();
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