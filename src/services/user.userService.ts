import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.userSchema';

import { UserDto } from '../dto/user.userDto';

import * as argon from 'argon2';
import { LoginData } from 'src/dto/user.loginData';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Hashes our input password using argon
   *
   * @param string - password passed in from endpoint
   * @returns Promise - resolves a hashed string after hashing
   *
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const hash = await argon.hash(password);

      return hash;
    } catch (err) {
      throw new HttpException(
        `Error within hashing password: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates our password, going to look to convert to return user and token
   *
   * @param string - username and password strings which can be used to validate
   * @returns boolean for now, want to abstract endpoint work to here
   *
   * This service will need to change in the future to return a custom class that includes
   * both a User and a token, the controller will also have to change
   */
  async validatePassAndSignToken(loginData: LoginData): Promise<any> {
    try {
      const user = await this.findOne(loginData.username);

      const result = await argon.verify(user.password, loginData.password);

      if (user && result) {
        //fetch token
        //need to change return type before this will work, after getting tokens working
        const payload = await this.assignToken(user.username);
        return payload;
      } else {
        throw new HttpException(
          'Incorrect username or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw new HttpException(
        `There was an error within verification of the password: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param userDto - User data transfer object, interface for user
   * @returns Promise which resolves the newly created user
   */
  async create(userDto: UserDto): Promise<User> {
    const hashedPass = await this.hashPassword(userDto.password);

    userDto.password = hashedPass;

    const newUser = new this.userModel(userDto);

    return newUser.save();
  }

  /**
   *
   * @returns promise of User Array
   */
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

  /**
   *
   * @param username - string username of user
   * @returns Promise object of a User
   */
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

  //the below tokens will leverage a service for tokens that we can import similar to how we import our userservice into our controller
  async assignToken(username: string) {
    try {
      const payload = { sub: username, username: username };

      return await this.jwtService.signAsync(payload);
    } catch (err) {
      throw new HttpException(
        `Error within signing of JWT: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //async validateToken(){}

  //async checkTokenExpiration(){}
}
