import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.userSchema';
import { UserController } from 'src/controllers/user.userController';
import { UserService } from 'src/services/user.userService';
import { TokenService } from 'src/services/user.tokenService';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
