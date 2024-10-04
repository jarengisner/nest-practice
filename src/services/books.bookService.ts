import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDto } from 'src/dto/books.bookDto';
import { Book, BookDocument } from 'src/schema/books.bookSchema';

Injectable();
export class BookService {
  constructor(@InjectModel('Book') private bookModel: Model<BookDocument>) {}

  /**
   * Service to get all books from the database
   *
   * @returns - Array of all Book objects that can be extracted from the database
   *
   */
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

  /**
   * Service to get one book by it's title from the database
   *
   * @param title - Title of the book
   * @returns - Promise of a Book class
   *
   */
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
          HttpStatus.NO_CONTENT,
        );
      }
    } catch (err) {
      throw new HttpException(
        `Error getting one book by title: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find a book by isbn number
   *
   * @param isbn - number used to identify books within global database, and this database
   * @returns - Promise of a Book class
   *
   */
  async getOneByISBN(isbn: number): Promise<Book> {
    try {
      const bookSearch = await this.bookModel
        .findOne({
          isbn: isbn,
        })
        .exec();

      if (bookSearch) {
        return bookSearch;
      } else {
        throw new HttpException(
          'No book found by that isbn number',
          HttpStatus.NO_CONTENT,
        );
      }
    } catch (err) {
      throw new HttpException(
        `Error in finding book by isbn: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Service to create books in DB
   *
   * @param - Book data transfer object, allows for schema creation
   * @returns - Promise of a Book object, after casting our data transfer object to an actual
   * Book class
   *
   */
  async createBook(bookDto: BookDto): Promise<Book> {
    try {
      const newBook = new this.bookModel(bookDto);

      return newBook.save();
    } catch (err) {
      throw new HttpException(
        `Error creating a new book entry: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param - isbn, identifying number for the book
   * @param - bookDto, data transfer object for the book
   * @returns Promise of a Book object, pulled from db
   *
   */
  async updateBookByISBN(isbn: number, bookDto: BookDto): Promise<Book> {
    try {
      const updatedBook = await this.bookModel.findOneAndUpdate(
        { isbn: isbn },
        {
          $set: {
            title: bookDto.title,
            description: bookDto.description,
            price: bookDto.price,
            quantity: bookDto.quantity,
            isbn: bookDto.isbn,
          },
        },
      );

      return updatedBook;
    } catch (err) {
      throw new HttpException(
        `Error updating the chosen book: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
