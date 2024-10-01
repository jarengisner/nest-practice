import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BookDto } from 'src/dto/books.bookDto';
import { Book } from 'src/schema/books.bookSchema';
import { BookService } from 'src/services/books.bookService';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAll(): Promise<Book[]> {
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
  async getOneBook(@Param('title') title: string): Promise<Book> {
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

  @Post()
  async createBook(@Body() bookDto: BookDto): Promise<Book> {}
}
