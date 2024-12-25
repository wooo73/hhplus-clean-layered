import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LectureHistory } from '../lecture-history/lecture-history';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => LectureHistory, (lectureHistory) => lectureHistory.user)
    lectureHistories: LectureHistory[];
}
