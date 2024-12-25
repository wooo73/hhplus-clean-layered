import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LectureHistory } from '../lecture-history/lecture-history';
import { Instructor } from '../instructor/instructor';

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, comment: '강의명' })
    title: string;

    @Column({ type: 'datetime', comment: '강의 시작일 YYYY-MM-DD HH:mm' })
    startAt: Date;

    @Column({ type: 'datetime', comment: '강의 종료일 YYYY-MM-DD HH:mm' })
    endAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => LectureHistory, (lectureHistory) => lectureHistory.lecture)
    lectureHistories: LectureHistory[];

    @ManyToOne(() => Instructor, (instructor) => instructor.lectures)
    @JoinColumn({ name: 'instructor_id', referencedColumnName: 'id' })
    instructor: Instructor;
}
