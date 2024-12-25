import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../../interface/controller/user/user.controller';

@Module({
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
