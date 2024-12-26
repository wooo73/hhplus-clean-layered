import { Body, Controller, Param, Post } from '@nestjs/common';
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
}
