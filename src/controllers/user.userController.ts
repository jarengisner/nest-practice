import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/services/user.userService';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
