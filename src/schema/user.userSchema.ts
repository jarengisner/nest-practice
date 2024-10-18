import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon from 'argon2';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BookDto } from 'src/dto/books.bookDto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  tradeListings: BookDto[];

  @Prop({ required: false })
  activeTradeBook: BookDto;

  @Prop({ required: false })
  tradeId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.hashPassword = async (password: string) => {
  try {
    const hash = await argon.hash(password);

    return hash;
  } catch (err) {
    throw new HttpException(
      `Error in hashing password: ${err.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
