import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IBook } from './book.interface';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  getBookById(@Param('id') id: number): Promise<IBook> {
    return this.bookService.getBook(id);
  }

  @Post()
  createBook(@Body() book: IBook): Promise<IBook> {
    return this.bookService.createBook(book);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<{ success: boolean }> {
    const isDeleted = await this.bookService.deleteBook(id);
    return { success: isDeleted };
  }

  @Patch(':id')
  updateBook(@Param('id') id: number, @Body() book: IBook): Promise<IBook> {
    return this.bookService.updateBook(id, book);
  }
}
