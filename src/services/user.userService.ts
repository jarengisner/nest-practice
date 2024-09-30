import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.userSchema';

import { UserDto } from '../dto/user.userDto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(userDto: UserDto): Promise<User> {
    const newUser = new this.userModel(userDto);

    return newUser.save();
  }

  //get all users
  async findAll(): Promise<any> {
    try {
      const allUsers: User[] = await this.userModel.find().exec();

      if (allUsers.length > 0) {
        return allUsers;
      } else {
        throw new HttpException('No users found: ', HttpStatus.I_AM_A_TEAPOT);
      }
    } catch (err) {
      throw new HttpException(
        `Internal Server Error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(username: string): Promise<User> {
    try {
      const searchUser: User = await this.userModel
        .findOne({
          username: username,
        })
        .exec();

      if (searchUser) {
        return searchUser;
      } else {
        throw new HttpException(
          'User could not be found: ',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      throw new HttpException(
        `Internal Server Error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
