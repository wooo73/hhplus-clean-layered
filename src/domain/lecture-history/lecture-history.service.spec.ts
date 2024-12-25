import { Test, TestingModule } from '@nestjs/testing';
import { LectureHistoryService } from './lecture-history.service';

describe('LectureHistoryService', () => {
    let service: LectureHistoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LectureHistoryService],
        }).compile();

        service = module.get<LectureHistoryService>(LectureHistoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
