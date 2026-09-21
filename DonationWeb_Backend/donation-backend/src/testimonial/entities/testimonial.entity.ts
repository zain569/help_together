import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('testimonial')
export class Testimonial {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    message: string;

    @Column({ type: 'int', nullable: true })
    rating: number;

    @Column({ default: true })
    isActive: boolean;
}
