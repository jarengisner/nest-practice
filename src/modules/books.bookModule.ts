import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from 'src/controllers/books.booksController';
import { bookSchema } from 'src/schema/books.bookSchema';
import { BookService } from 'src/services/books.bookService';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Book', schema: bookSchema }])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
