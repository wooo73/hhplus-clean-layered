import { Lecture } from './lecture';

export interface ILectureRepository {
    findLectureById(lectureId: number): Promise<Lecture>;
}
