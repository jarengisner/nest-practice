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


  /**
   * Returns all books from the database
   *
   * @returns Array of Book objects
   *
   */
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

  /**
   * Takes in the title of a book and returns a Book object
   *
   * @param path variable string - title of a book within the database
   * @returns Book object of searched book, handles errors with HttpException
   *
   */
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

  /**
   * Fetches a book by it's isbn number
   *
   * @param string - isbn number path variable, needs to be parsed into number
   * @returns Promise<Book> - returns a promise, when resolved gives book from db
   *
   */
  @Get(':isbn')
  async getOneBookByISBN(@Param('isbn') isbn: string): Promise<Book> {
    try {
      const isbnNum: number = parseInt(isbn);

      const isbnBook = await this.bookService.getOneByISBN(isbnNum);

      return isbnBook;
    } catch (err) {
      throw new HttpException(
        `Error occurred on endpoint side of finding one book by isbn: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Takes in a book data transfer object, and our service casts it into a Book
   * and then sends to db
   *
   * @param BookDto - book data transfer object
   * @returns Promise<Book> - Book object returned after db post
   *
   */

  @Post()
  async createBook(@Body() bookDto: BookDto): Promise<Book> {
    try {
      return await this.bookService.createBook(bookDto);
    } catch (err) {
      throw new HttpException(
        `An error occurred while creating a book: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
