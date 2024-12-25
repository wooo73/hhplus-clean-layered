import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/user.module';
import { LectureModule } from './domain/lecture/lecture.module';
import { LectureHistoryModule } from './domain/lecture-history/lecture-history.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { TypeOrmConfigService } from './infrastructure/database/typeorm.config.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        UserModule,
        LectureModule,
        LectureHistoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
