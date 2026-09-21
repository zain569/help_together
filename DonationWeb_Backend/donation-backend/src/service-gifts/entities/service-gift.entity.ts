import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import type { Relation } from "typeorm";
import { DonationEntity } from "../../donation/entities/donation.entity.js";

@Entity('service-gifts')
export class ServiceGift {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @OneToMany(()=> DonationEntity, (donations) => donations.serviceGift)
    donations: Relation<DonationEntity>

    @Column({nullable: true})
    imageUrl: string;

    @Column()
    isActive: boolean;
}
