import { BookDto } from './books.bookDto';

export class UserDto {
  username: string;
  password: string;
  tradeListings: BookDto[] | null;
  activeTradeBook: BookDto | null;
  tradeId: number | null;
}
