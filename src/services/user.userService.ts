import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.userSchema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserData: {
    username: string;
    password: string;
  }): Promise<User> {
    const newUser = new this.userModel(createUserData);

    return newUser.save();
  }

  //get all users
  async findAll(): Promise<any> {
    return this.userModel.find().exec();
  }
}
