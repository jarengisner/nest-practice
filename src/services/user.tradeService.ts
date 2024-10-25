import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/user.userDto';
import { User, UserDocument } from 'src/schema/user.userSchema';


interface tradeReturn{
  user1: User;
  user2: User;
};

export class TradeService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async trade(user1: UserDto, user2: UserDto): Promise<any> {
    const tradeUser1 = await this.userModel.find({username: user1.username});
    const tradeUser2 = await this.userModel.find({username: user2.username});
  }
}
