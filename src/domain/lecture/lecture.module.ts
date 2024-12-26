import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from '../../interface/controller/lecture/lecture.controller';
import { LectureRepository } from '../../infrastructure/lecture/lecture.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './lecture';
import { LectureHistoryRepository } from '../../infrastructure/lecture-history/lecture-history.repository';
import { LectureHistory } from '../lecture-history/lecture-history';

@Module({
    imports: [TypeOrmModule.forFeature([Lecture, LectureHistory])],
    controllers: [LectureController],
    providers: [
        LectureService,
        { provide: 'ILectureRepository', useClass: LectureRepository },
        { provide: 'ILectureHistoryRepository', useClass: LectureHistoryRepository },
    ],
})
export class LectureModule {}
