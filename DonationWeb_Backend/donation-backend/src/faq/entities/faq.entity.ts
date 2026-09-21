import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    question: string;

    @Column({ type: 'text' })
    answer: string;

    @Column({ type: 'int', default: 0 })
    displayOver: number;

    @Column({ default: true })
    isActive: boolean
}
