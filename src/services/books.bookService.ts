import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schema/books.bookSchema';

Injectable();
export class BookService {
  constructor(@InjectModel('Book') private bookModel: Model<BookDocument>) {}

  async getAll(): Promise<any> {
    try {
      const allBooks: Book[] = await this.bookModel.find().exec();

      if (allBooks.length > 0) {
        return allBooks;
      } else {
        throw new HttpException(
          'Could not find any books within the system',
          HttpStatus.I_AM_A_TEAPOT,
        );
      }
    } catch (err) {
      throw new HttpException(
        `Error getting all books from the database: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneByTitle(title: string): Promise<Book> {
    try {
      const singleBook = await this.bookModel
        .findOne({
          title: title,
        })
        .exec();

      if (singleBook) {
        return singleBook;
      } else {
        throw new HttpException(
          'No books found with that title',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      throw new HttpException(
        `Error getting one book by title: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
