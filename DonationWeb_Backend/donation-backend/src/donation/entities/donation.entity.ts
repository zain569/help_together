import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { User } from "../../user/user.entity.js";
import { CampaignEntity } from "../../campaigns/entities/campaign.entity.js";
import { ServiceGift } from "../../service-gifts/entities/service-gift.entity.js";


export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
}

export enum PaymentMethod {
    STRIPE = 'STRIPE',
    MANUAL = 'MANUAL',
}
@Entity('donation')
export class DonationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    amount: number;

    @ManyToOne(() => User, (user) => user.donations)
    user: Relation<User>;

    @ManyToOne(() => CampaignEntity, (campaigns) => campaigns.donations, { nullable: true })
    campaign: Relation<CampaignEntity>;

    @ManyToOne(() => ServiceGift, (serviceGifts) => serviceGifts.donations, { nullable: true })
    serviceGift: Relation<ServiceGift>

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.STRIPE,
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: 'varchar',
        length: 3,
        default: 'PKR',
    })
    currency: string;

    @Column({ nullable: true })
    stripeSessionId: string;

    @Column({nullable: true})
    stripePaymentIntentId : string

    @CreateDateColumn()
    createdAt: Date;
}