import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { DonationEntity } from "../donation/entities/donation.entity.js";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
}


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(()=> DonationEntity, (donation)=> donation.user)
    donations: Relation<DonationEntity[]>;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({nullable: true})
    profileimage: string
}