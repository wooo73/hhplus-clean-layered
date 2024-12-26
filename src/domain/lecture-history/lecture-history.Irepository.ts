import { Lecture } from '../lecture/lecture';
import { LectureHistory } from './lecture-history';

export interface ILectureHistoryRepository {
    getUserLectureHistories(userId: number): Promise<LectureHistory[]>;

    findLectureHistory(userId: number, lectureId: number): Promise<LectureHistory>;

    isLectureFull(lectureId: number, capacity: number): Promise<boolean>;

    isDuplicateLectureSchedule(userId: number, startAt: Date, endAt: Date): Promise<boolean>;

    saveLectureHistory(userId: number, lecture: Lecture): Promise<LectureHistory>;
}
