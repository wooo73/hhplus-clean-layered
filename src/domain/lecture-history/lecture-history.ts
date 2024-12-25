import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user';
import { Lecture } from '../lecture/lecture';

@Entity()
@Unique('UQ_USER_ID_LECTURE_ID', ['userId', 'lectureId']) //중복 강의 신청 방지 복합키 설정
export class LectureHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', type: 'int', comment: '수강 유저 id' })
    userId: number;

    @Column({ name: 'lecture_id', type: 'int', comment: '수강 강의 id' })
    lectureId: number;

    @Column({ name: 'lecture_title', type: 'varchar', length: 50, comment: '수강 강의명' })
    lectureTitle: string;

    @Column({ name: 'instructor_name', type: 'varchar', length: 10, comment: '강사명' })
    instructorName: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Lecture, (lecture) => lecture.lectureHistories)
    @JoinColumn({ name: 'lecture_id', referencedColumnName: 'id' })
    lecture: Lecture;
}
