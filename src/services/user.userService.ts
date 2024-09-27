import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.userSchema';

import {UserDto} from '../dto/user.userDto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(userDto : UserDto): Promise<User> {
    const newUser = new this.userModel(userDto);

    return newUser.save();
  }

  //get all users
  async findAll(): Promise<any> {
    return this.userModel.find().exec();
  }
}
