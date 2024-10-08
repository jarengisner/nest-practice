import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon from 'argon2';
import { HttpException, HttpStatus } from '@nestjs/common';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;
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

/*UserSchema.methods.validatePassword = async (password: string) => {
  try {
    return await argon.verify(this.password, password);
  } catch (err) {
    throw new HttpException(
      `Error within validation of the password: ${err.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};*/
