import { Injectable } from '@nestjs/common';
import { ILectureHistoryRepository } from 'src/domain/lecture-history/lecture-history.Irepository';

@Injectable()
export class LectureHistoryRepository implements ILectureHistoryRepository {}
