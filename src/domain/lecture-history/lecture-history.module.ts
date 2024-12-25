import { Module } from '@nestjs/common';
import { LectureHistoryService } from './lecture-history.service';

@Module({
    providers: [LectureHistoryService],
})
export class LectureHistoryModule {}
