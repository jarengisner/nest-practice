import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Book } from 'src/schema/books.bookSchema';
import { BookService } from 'src/services/books.bookService';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAll() {
    try {
      return await this.bookService.getAll();
    } catch (err) {
      throw new HttpException(
        `Error fetching books from database: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':title')
  async getOneBook(@Param('title') title: string) {
    try {
      const book = await this.bookService.getOneByTitle(title);
      return book;
    } catch (err) {
      throw new HttpException(
        `Error occurred while finding single book: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
