import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LectureService } from '../../../domain/lecture/lecture.service';

@Controller('/lectures')
export class LectureController {
    constructor(private readonly lectureService: LectureService) {}

    @Post(':lectureId/apply')
    async lecture(@Param('lectureId') lectureId: string, @Body('id') id) {
        const userId = parseInt(id);
        const parseLectureId = parseInt(lectureId);
        return await this.lectureService.applyLecture(userId, parseLectureId);
    }

    @Get('available/user/:userId')
    async getAvailableLectures(
        @Param('userId') id: string,
        @Query('startAt') startAt: string,
        @Query('endAt') endAt: string,
    ) {
        const userId = parseInt(id);
        const startAtDate = `${startAt} 00:00:00`;
        const endAtDate = `${endAt} 23:59:59`;

        return await this.lectureService.getAvailableLectures(userId, startAtDate, endAtDate);
    }
}
