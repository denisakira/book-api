import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IBook } from './book.interface';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(): Promise<IBook[]> {
    return this.bookService.getBooks();
  }

  @Get(':id')
  getBookById(@Param('id') id: number): Promise<IBook> {
    return this.bookService.getBookById(id);
  }

  @Post()
  createBook(@Body() book: IBook): Promise<IBook> {
    return this.bookService.createBook(book);
  }
}
