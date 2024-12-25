import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Instructor } from 'src/domain/instructor/instructor';
import { LectureHistory } from 'src/domain/lecture-history/lecture-history';
import { Lecture } from 'src/domain/lecture/lecture';
import { User } from 'src/domain/user/user';

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
        };
    }
}
