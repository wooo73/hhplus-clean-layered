import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Lecture } from '../lecture/lecture';

@Entity()
export class Instructor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10, comment: '강사명' })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Lecture, (lecture) => lecture.instructor)
    lectures: Lecture[];
}
