import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Instructor } from '../../domain/instructor/instructor';
import { LectureHistory } from '../../domain/lecture-history/lecture-history';
import { Lecture } from '../../domain/lecture/lecture';
import { User } from '../../domain/user/user';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: +this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USER'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [User, Lecture, LectureHistory, Instructor],
            synchronize: false,
            autoLoadEntities: true, // 자동으로 엔티티를 로드
            logging: true,
        };
    }
}
