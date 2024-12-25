import { Injectable } from '@nestjs/common';
import { ILectureRepository } from 'src/domain/lecture/lecture.Irepository';

@Injectable()
export class lectureRepository implements ILectureRepository {}
