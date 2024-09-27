import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {

 @Prop({ required: true }) 
   title: string;

 @Prop({ required: true }) 
  description: string;

 @Prop({ required: true }) 
  author: string;

 @Prop({ required: true }) 
  price: number;

 @Prop({ required: true }) 
  quantity: number;

 @Prop({ required: true }) 
  isbn: number;

};

export const bookSchema = SchemaFactory.createForClass(Book); 
