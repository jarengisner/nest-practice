import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { Book } from "src/schema/books.bookSchema";
import { BookService } from "src/services/books.bookService";

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService){};

  @Get()
  async getAll() {
    try{
      return await this.bookService.getAll();
    } catch(err) {
      throw new HttpException(`Error fetching books from database: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
