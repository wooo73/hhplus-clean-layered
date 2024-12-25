import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './domain/user/user.module';
import { LectureHistoryModule } from './domain/lecture-history/lecture-history.module';
import { LectureModule } from './domain/lecture/lecture.module';

@Module({
    imports: [UserModule, LectureModule, LectureHistoryModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
