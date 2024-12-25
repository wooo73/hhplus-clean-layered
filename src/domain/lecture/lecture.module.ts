import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from '../../interface/controller/lecture/lecture.controller';

@Module({
    controllers: [LectureController],
    providers: [LectureService],
})
export class LectureModule {}
