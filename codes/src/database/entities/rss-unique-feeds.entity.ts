// src/database/entities/rss-unique-feeds.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('rss_unique_feeds')
@Index(['source', 'pub_date']) // Performance optimization for common queries
@Index(['link'], { unique: true }) // Prevent duplicate links
export class RssUniqueFeeds {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: false,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 1000,
        nullable: false,
        unique: true, // Prevent duplicate feeds
    })
    link: string;

    @Column({
        type: 'datetime',
        nullable: false,
    })
    pub_date: Date;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    source: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string | null;

    @Column({
        type: 'text',
        nullable: true,
    })
    category: string | null;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
}