import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('rss_unique_feeds')
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
        length: 255,
        nullable: false,
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

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    created_at: Date;
}