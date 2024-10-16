import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { LoginData } from 'src/dto/user.loginData';
import { UserDto } from 'src/dto/user.userDto';
import { User } from 'src/schema/user.userSchema';
import { UserService } from 'src/services/user.userService';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      throw new HttpException(
        `Error in finding all books: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param username
   * @returns
   */
  @Get(':username')
  async getOne(@Param('username') username: string) {
    try {
      const queryUser = await this.userService.findOne(username);

      if (queryUser) {
        return queryUser;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (err) {
      throw new HttpException(
        `Internal Error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Creates user from data transfer object
   *
   * @param userDto - data transfer object for a user
   * @returns Promise - resolves a User object
   *
   */
  @Post()
  async createUser(@Body() userDto: UserDto): Promise<User> {
    try {
      const newUser = await this.userService.create(userDto);
      return newUser;
    } catch (err) {
      throw new HttpException(
        `Failed to create user: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Working, validates password
   *
   * @param Body - login data object that will be formed from body
   * @returns Currently returns a boolean value to see if verified, want to change to return user and token to store
   *
   */
  @Post('login')
  async login(@Body() loginData: LoginData): Promise<any> {
    try {
      return await this.userService.validatePassAndSignToken(loginData);
    } catch (err) {
      throw new HttpException(
        `Something occurred in endpoint side of user validation: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
