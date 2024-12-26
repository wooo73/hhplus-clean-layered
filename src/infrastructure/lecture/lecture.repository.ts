import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from '../../domain/lecture/lecture';
import { ILectureRepository } from '../../domain/lecture/lecture.Irepository';
import { Repository } from 'typeorm';

@Injectable()
export class LectureRepository implements ILectureRepository {
    constructor(@InjectRepository(Lecture) private lectureRepository: Repository<Lecture>) {}

    async findLectureById(lectureId: number): Promise<Lecture> {
        return this.lectureRepository.findOne({
            relations: {
                instructor: true,
            },
            where: { id: lectureId },
        });
    }

    async getUserLectures(userId: number): Promise<Lecture[]> {
        return await this.lectureRepository
            .createQueryBuilder('lecture')
            .innerJoin('lecture_history', 'history', 'history.lecture_id = lecture.id')
            .where('history.userId = :userId', { userId })
            .getMany();
    }

    async availableLectures(startAt: string, endAt: string): Promise<Lecture[]> {
        return await this.lectureRepository
            .createQueryBuilder('lecture')
            .leftJoin('lecture_history', 'history', 'history.lecture_id = lecture.id')
            .where('lecture.startAt >= :startAt', { startAt })
            .andWhere('lecture.endAt <= :endAt', { endAt })
            .groupBy('lecture.id')
            .having('count(lecture.id) < lecture.capacity')
            .getMany();
    }
}
