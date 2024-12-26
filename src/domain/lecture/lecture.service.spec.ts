import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { LectureService } from './lecture.service';

import { ILectureRepository } from './lecture.Irepository';
import { ILectureHistoryRepository } from '../lecture-history/lecture-history.Irepository';
import { Lecture } from './lecture';
import { LectureHistory } from '../lecture-history/lecture-history';

describe('LectureService', () => {
    let service: LectureService;
    let lectureRepository: jest.Mocked<ILectureRepository>;
    let lectureHistoryRepository: jest.Mocked<ILectureHistoryRepository>;
    let dataSource: jest.Mocked<DataSource>;

    beforeEach(async () => {
        lectureRepository = {
            findLectureById: jest.fn(),
            getUserLectures: jest.fn(),
            availableLectures: jest.fn(),
        };

        lectureHistoryRepository = {
            getUserLectureHistories: jest.fn(),
            findLectureHistory: jest.fn(),
            isDuplicateLectureSchedule: jest.fn(),
            isLectureFull: jest.fn(),
            saveLectureHistory: jest.fn(),
        };

        dataSource = {
            createQueryRunner: jest.fn().mockReturnValue({
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
            }),
            manager: {},
            initialize: jest.fn(),
            destroy: jest.fn(),
            query: jest.fn(),
            queryRunner: {},
            driver: {},
            options: {},
            isInitialized: true,
            name: 'default',
            '@instanceof': Symbol('DataSource'),
        } as unknown as jest.Mocked<DataSource>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LectureService,
                { provide: 'ILectureRepository', useValue: lectureRepository },
                { provide: 'ILectureHistoryRepository', useValue: lectureHistoryRepository },
                { provide: DataSource, useValue: dataSource },
            ],
        }).compile();

        service = module.get(LectureService);
    });

    describe('특강 신청 단위 테스트', () => {
        it('FAIL_존재 하지 않는 강의를 신청할 경우 오류가 발생하는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;

            lectureRepository.findLectureById.mockResolvedValue(null);

            // when & then
            await expect(service.applyLecture(userId, lectureId)).rejects.toThrow(
                new NotFoundException('해당 강의를 찾을 수 없습니다.'),
            );
            expect(lectureRepository.findLectureById).toHaveBeenCalledWith(lectureId);
        });
        it('FAIL_신청한 강의를 재신청할 경우 오류가 발생하는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;
            const lectureTitle = '강의1';
            const instructorName = '강사1';

            const lecture: Partial<Lecture> = {
                id: lectureId,
                title: lectureTitle,
                startAt: new Date('2024-12-21T04:00:00.000Z'),
                endAt: new Date('2024-12-21T06:00:00.000Z'),
                capacity: 30,
            };

            lectureRepository.findLectureById.mockResolvedValue(lecture as Lecture);

            const lectureHistory: Partial<LectureHistory> = {
                userId,
                lectureId,
                lectureTitle,
                instructorName,
                startAt: new Date('2024-12-21T04:00:00.000Z'),
                endAt: new Date('2024-12-21T06:00:00.000Z'),
            };

            lectureHistoryRepository.findLectureHistory.mockResolvedValue(
                lectureHistory as LectureHistory,
            );

            // when & then
            await expect(service.applyLecture(userId, lectureId)).rejects.toThrow(
                new ConflictException('이미 신청한 강의입니다.'),
            );

            expect(lectureRepository.findLectureById).toHaveBeenCalledWith(lectureId);
            expect(lectureHistoryRepository.findLectureHistory).toHaveBeenCalledWith(
                userId,
                lectureId,
            );
        });
        it('FAIL_새로 신청하려는 강의와 이미 신청한 강의의 시간이 겹치는 경우, 오류가 발생하는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;
            const lectureTitle = '강의1';

            const lecture: Partial<Lecture> = {
                id: lectureId,
                title: lectureTitle,
                startAt: new Date('2024-12-21T13:00:00+09:00'),
                endAt: new Date('2024-12-21T15:00:00+09:00'),
                capacity: 30,
            };
            lectureRepository.findLectureById.mockResolvedValue(lecture as Lecture);
            lectureHistoryRepository.findLectureHistory.mockResolvedValue(null);
            lectureHistoryRepository.isDuplicateLectureSchedule.mockResolvedValue(true);

            // when & then
            await expect(service.applyLecture(userId, lectureId)).rejects.toThrow(
                new ConflictException('신청한 강의와 겹치는 시간대의 강의가 있습니다.'),
            );
            expect(lectureRepository.findLectureById).toHaveBeenCalledWith(lectureId);
            expect(lectureHistoryRepository.findLectureHistory).toHaveBeenCalledWith(
                userId,
                lectureId,
            );
            expect(lectureHistoryRepository.isDuplicateLectureSchedule).toHaveBeenCalledWith(
                userId,
                lecture.startAt,
                lecture.endAt,
            );
        });
        it('FAIL_수강 자리가 없는 경우 오류가 발생하는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;
            const lectureTitle = '강의1';

            const lecture: Partial<Lecture> = {
                id: lectureId,
                title: lectureTitle,
                startAt: new Date('2024-12-21T13:00:00+09:00'),
                endAt: new Date('2024-12-21T15:00:00+09:00'),
                capacity: 30,
            };
            lectureRepository.findLectureById.mockResolvedValue(lecture as Lecture);
            lectureHistoryRepository.findLectureHistory.mockResolvedValue(null);
            lectureHistoryRepository.isDuplicateLectureSchedule.mockResolvedValue(false);
            lectureHistoryRepository.isLectureFull.mockResolvedValue(true);

            // when & then
            await expect(service.applyLecture(userId, lectureId)).rejects.toThrow(
                new ConflictException('수강 인원이 꽉 찼습니다.'),
            );

            expect(lectureRepository.findLectureById).toHaveBeenCalledWith(lectureId);
            expect(lectureHistoryRepository.findLectureHistory).toHaveBeenCalledWith(
                userId,
                lectureId,
            );
            expect(lectureHistoryRepository.isDuplicateLectureSchedule).toHaveBeenCalledWith(
                userId,
                lecture.startAt,
                lecture.endAt,
            );
            expect(lectureHistoryRepository.isLectureFull).toHaveBeenCalledWith(
                lectureId,
                lecture.capacity,
            );
        });
        it('SUCCESS_수강 신청이 정상적으로 이뤄 지는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;
            const lectureTitle = '강의1';
            const instructorName = '강사1';
            const startAt = new Date('2024-12-21T04:00:00.000Z');
            const endAt = new Date('2024-12-21T06:00:00.000Z');
            const capacity = 30;

            const lecture: Partial<Lecture> = {
                id: lectureId,
                title: lectureTitle,
                startAt,
                endAt,
                capacity,
            };
            lectureRepository.findLectureById.mockResolvedValue(lecture as Lecture);
            lectureHistoryRepository.findLectureHistory.mockResolvedValue(null);
            lectureHistoryRepository.isDuplicateLectureSchedule.mockResolvedValue(false);
            lectureHistoryRepository.isLectureFull.mockResolvedValue(false);

            const history: Partial<LectureHistory> = {
                userId,
                lectureId,
                lectureTitle,
                instructorName,
                startAt,
                endAt,
            };

            lectureHistoryRepository.saveLectureHistory.mockResolvedValue(
                history as LectureHistory,
            );

            // when
            const result = await service.applyLecture(userId, lectureId);

            // then
            expect(result).toBeDefined();
            expect(result).toEqual(history);
            expect(lectureRepository.findLectureById).toHaveBeenCalledWith(lectureId);
            expect(lectureHistoryRepository.findLectureHistory).toHaveBeenCalledWith(
                userId,
                lectureId,
            );
            expect(lectureHistoryRepository.isDuplicateLectureSchedule).toHaveBeenCalledWith(
                userId,
                lecture.startAt,
                lecture.endAt,
            );
            expect(lectureHistoryRepository.isLectureFull).toHaveBeenCalledWith(
                lectureId,
                lecture.capacity,
            );
            expect(lectureHistoryRepository.saveLectureHistory).toHaveBeenCalledWith(
                userId,
                lecture,
            );
        });
    });

    describe('특강 신청 가능 목록 단위 테스트', () => {
        it('SUCCESS_신청한 강의를 제외하고 응답 하는가? ', async () => {
            // given
            const userId = 1;
            const startAt = '2024-12-21 00:00:00';
            const endAt = '2024-12-21 23:59:59';

            const userLectures: Partial<Lecture>[] = [
                {
                    id: 1,
                    title: '강의1',
                    startAt: new Date('2024-12-21T04:00:00.000Z'),
                    endAt: new Date('2024-12-21T06:00:00.000Z'),
                    capacity: 30,
                },
            ];

            const availableLectureList: Partial<Lecture>[] = [
                {
                    id: 1,
                    title: '강의1',
                    startAt: new Date('2024-12-21T04:00:00.000Z'),
                    endAt: new Date('2024-12-21T06:00:00.000Z'),
                    capacity: 30,
                },
                {
                    id: 2,
                    title: '강의2',
                    startAt: new Date('2024-12-21T07:00:00.000Z'),
                    endAt: new Date('2024-12-21T09:00:00.000Z'),
                    capacity: 30,
                },
            ];

            lectureRepository.getUserLectures.mockResolvedValue(userLectures as Lecture[]);
            lectureRepository.availableLectures.mockResolvedValue(
                availableLectureList as Lecture[],
            );

            // when
            const result = await service.getAvailableLectures(userId, startAt, endAt);

            // then
            expect(result).toBeDefined();
            expect(result).toEqual([availableLectureList[1]]);
            expect(lectureRepository.getUserLectures).toHaveBeenCalledWith(userId);
            expect(lectureRepository.availableLectures).toHaveBeenCalledWith(startAt, endAt);
        });

        it('SUCCESS_신청한 강의 일정과 겹치지 않는 강의만 응답 하는가? ', async () => {
            // given
            const userId = 1;
            const startAt = '2024-12-21 00:00:00';
            const endAt = '2024-12-21 23:59:59';

            const userLectures: Partial<Lecture>[] = [
                {
                    id: 1,
                    title: '강의1',
                    startAt: new Date('2024-12-21T04:00:00.000Z'),
                    endAt: new Date('2024-12-21T06:00:00.000Z'),
                    capacity: 30,
                },
            ];

            const availableLectureList: Partial<Lecture>[] = [
                {
                    id: 1, //신청한 강의
                    title: '강의1',
                    startAt: new Date('2024-12-21T04:00:00.000Z'),
                    endAt: new Date('2024-12-21T06:00:00.000Z'),
                    capacity: 30,
                },
                {
                    id: 2, //안겹침
                    title: '강의2',
                    startAt: new Date('2024-12-21T07:00:00.000Z'),
                    endAt: new Date('2024-12-21T09:00:00.000Z'),
                    capacity: 30,
                },
                {
                    id: 3, //겹침
                    title: '강의3',
                    startAt: new Date('2024-12-21T05:00:00.000Z'),
                    endAt: new Date('2024-12-21T07:00:00.000Z'),
                    capacity: 30,
                },
                {
                    id: 4, //안겹침
                    title: '강의4',
                    startAt: new Date('2024-12-21T10:00:00.000Z'),
                    endAt: new Date('2024-12-21T11:00:00.000Z'),
                    capacity: 30,
                },
            ];

            lectureRepository.getUserLectures.mockResolvedValue(userLectures as Lecture[]);
            lectureRepository.availableLectures.mockResolvedValue(
                availableLectureList as Lecture[],
            );

            // when
            const result = await service.getAvailableLectures(userId, startAt, endAt);

            // then
            expect(result).toBeDefined();
            expect(result).toEqual([availableLectureList[1], availableLectureList[3]]);
            expect(lectureRepository.getUserLectures).toHaveBeenCalledWith(userId);
            expect(lectureRepository.availableLectures).toHaveBeenCalledWith(startAt, endAt);
        });
    });

    describe('신청한 강의 목록 단위 테스트', () => {
        it('SUCCESS_신청한 강의 목록을 응답 하는가?', async () => {
            // given
            const userId = 1;
            const lectureId = 1;
            const lectureTitle = '강의1';
            const instructorName = '강사1';
            const startAt = new Date('2024-12-21T04:00:00.000Z');
            const endAt = new Date('2024-12-21T06:00:00.000Z');

            const history: Partial<LectureHistory> = {
                userId,
                lectureId,
                lectureTitle,
                instructorName,
                startAt,
                endAt,
            };

            lectureHistoryRepository.getUserLectureHistories.mockResolvedValue(
                history as LectureHistory[],
            );

            // when & then
            expect(await service.lectureHistory(userId)).toEqual(history);
        });
    });
});
