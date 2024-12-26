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
}
