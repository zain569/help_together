import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DonationEntity } from "../../donation/entities/donation.entity.js";
import type { Relation } from "typeorm";
import { CauseEntity } from "../../causes/entities/cause.entity.js";


export enum CampaignStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    FUNDED = 'funded',
    ARCHIVED = 'archived',
}

@Entity('campaigns')
export class CampaignEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    goalAmount: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    collectedAmount: number;

    @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
    remainingAmount: number;

    @OneToMany(() => DonationEntity, (donation) => donation.campaign)
    donations: Relation<DonationEntity>;

    @ManyToOne(
        () => CauseEntity,
        (cause) => cause.campaigns,
    )
    cause: Relation<CauseEntity>;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ default: false })
    zakatEligible: boolean;

    @Column({ default: false })
    urgent: boolean;

    @Column({
        type: 'enum',
        enum: CampaignStatus,
        default: CampaignStatus.PUBLISHED
    })
    status: CampaignStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}