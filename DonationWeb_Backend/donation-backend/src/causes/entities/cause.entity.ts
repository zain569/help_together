import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { CampaignEntity } from "../../campaigns/entities/campaign.entity.js";

@Entity('causes')
export class CauseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: 0 })
    displayOrder: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => CampaignEntity,
        (campaign) => campaign.cause)
    campaigns: Relation<CampaignEntity>
}
