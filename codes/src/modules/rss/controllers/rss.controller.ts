// src/modules/rss/controllers/rss.controller.ts
import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RssService } from '../services/rss.service';
import { RssUniqueFeeds } from '../../../database';

@ApiTags('RSS Feeds')
@Controller('rss')
export class RssController {
    constructor(private readonly rssService: RssService) {}

    @Get()
    @ApiOperation({ summary: 'Get all RSS feeds' })
    @ApiResponse({ status: 200, description: 'List of RSS feeds' })
    async getAllFeeds() {
        return this.rssService.getAllFeeds();
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recent RSS feeds' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getRecentFeeds(@Query('limit', ParseIntPipe) limit: number = 10) {
        return this.rssService.getRecentFeeds(limit);
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Get RSS feed statistics' })
    async getStatistics() {
        return this.rssService.getFeedStatistics();
    }

    @Get('sources')
    @ApiOperation({ summary: 'Get unique RSS sources' })
    async getUniqueSources() {
        return this.rssService.getUniqueSources();
    }

    @Get('search')
    @ApiOperation({ summary: 'Search RSS feeds by title' })
    @ApiQuery({ name: 'q', required: true, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    async searchFeeds(
        @Query('q') searchTerm: string,
        @Query('page', ParseIntPipe) page: number = 1,
    ) {
        return this.rssService.searchFeeds(searchTerm, page);
    }

    @Get('source/:source')
    @ApiOperation({ summary: 'Get RSS feeds by source' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getFeedsBySource(
        @Param('source') source: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return this.rssService.getFeedsBySource(source, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get RSS feed by ID' })
    async getFeedById(@Param('id', ParseIntPipe) id: number) {
        return this.rssService.getFeedById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new RSS feed' })
    async createFeed(@Body() feedData: Partial<RssUniqueFeeds>) {
        return this.rssService.createFeed(feedData);
    }

    @Post('bulk-import')
    @ApiOperation({ summary: 'Bulk import RSS feeds' })
    async bulkImportFeeds(@Body() feeds: Partial<RssUniqueFeeds>[]) {
        await this.rssService.bulkImportFeeds(feeds);
        return { message: 'Feeds imported successfully', count: feeds.length };
    }
}