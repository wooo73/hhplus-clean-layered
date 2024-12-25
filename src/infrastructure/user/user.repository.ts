import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/user/user.Irepository';

@Injectable()
export class User implements IUserRepository {}
