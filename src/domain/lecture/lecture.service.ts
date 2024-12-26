import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILectureRepository } from './lecture.Irepository';
import { ILectureHistoryRepository } from '../lecture-history/lecture-history.Irepository';
import { DataSource } from 'typeorm';
import { LectureHistory } from '../lecture-history/lecture-history';

@Injectable()
export class LectureService {
    constructor(
        @Inject('ILectureRepository') private lectureRepository: ILectureRepository,
        @Inject('ILectureHistoryRepository')
        private lectureHistoryRepository: ILectureHistoryRepository,
        private dataSource: DataSource,
    ) {}

    async applyLecture(userId: number, lectureId: number): Promise<LectureHistory> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const findLecture = await this.lectureRepository.findLectureById(lectureId);
            if (!findLecture) {
                throw new NotFoundException('해당 강의를 찾을 수 없습니다.');
            }

            const findLectureHistory = await this.lectureHistoryRepository.findLectureHistory(
                userId,
                lectureId,
            );
            if (findLectureHistory) {
                throw new ConflictException('이미 신청한 강의입니다.');
            }

            const isDuplicateLectureSchedule =
                await this.lectureHistoryRepository.isDuplicateLectureSchedule(
                    userId,
                    findLecture.startAt,
                    findLecture.endAt,
                );
            if (isDuplicateLectureSchedule) {
                throw new ConflictException('신청한 강의와 겹치는 시간대의 강의가 있습니다.');
            }

            const isLectureFull = await this.lectureHistoryRepository.isLectureFull(
                lectureId,
                findLecture.capacity,
            );
            if (isLectureFull) {
                throw new ConflictException('수강 인원이 꽉 찼습니다.');
            }

            const history = await this.lectureHistoryRepository.saveLectureHistory(
                userId,
                findLecture,
            );
            await queryRunner.commitTransaction();

            return history;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
