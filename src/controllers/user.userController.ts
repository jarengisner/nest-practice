import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.userDto';
import { User } from 'src/schema/user.userSchema';
import { UserService } from 'src/services/user.userService';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<User>{
    const newUser = await this.userService.create(userDto);
    return newUser;
  }
}
