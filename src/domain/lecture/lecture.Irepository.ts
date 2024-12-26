import { Lecture } from './lecture';

export interface ILectureRepository {
    findLectureById(lectureId: number): Promise<Lecture>;

    getUserLectures(userId: number): Promise<Lecture[]>;

    availableLectures(startAt: string, endAt: string): Promise<Lecture[]>;
}
