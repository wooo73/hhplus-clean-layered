import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LectureHistory } from '../../domain/lecture-history/lecture-history';
import { ILectureHistoryRepository } from '../../domain/lecture-history/lecture-history.Irepository';
import { Lecture } from '../../domain/lecture/lecture';
import { Repository } from 'typeorm';

@Injectable()
export class LectureHistoryRepository implements ILectureHistoryRepository {
    constructor(
        @InjectRepository(LectureHistory)
        private lectureHistoryRepository: Repository<LectureHistory>,
    ) {}

    async findLectureHistory(userId: number, lectureId: number): Promise<LectureHistory> {
        return this.lectureHistoryRepository.findOne({
            where: { userId, lectureId },
        });
    }

    async isLectureFull(lectureId: number, capacity: number): Promise<boolean> {
        const lectureHistoryCount = await this.lectureHistoryRepository.count({
            where: { lectureId },
        });
        return lectureHistoryCount >= capacity;
    }

    async isDuplicateLectureSchedule(userId: number, startAt: Date, endAt: Date): Promise<boolean> {
        return await this.lectureHistoryRepository
            .createQueryBuilder('lh')
            .where('lh.userId = :userId', { userId })
            .andWhere('lh.startAt <= :endAt', { endAt })
            .andWhere('lh.endAt >= :startAt', { startAt })
            .getExists();
    }

    async saveLectureHistory(userId: number, lecture: Lecture): Promise<LectureHistory> {
        return await this.lectureHistoryRepository.save({
            userId,
            lectureId: lecture.id,
            lectureTitle: lecture.title,
            instructorName: lecture.instructor.name,
            startAt: lecture.startAt,
            endAt: lecture.endAt,
        });
    }
}
