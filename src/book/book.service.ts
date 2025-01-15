import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { IBook } from './book.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  createBook(book: IBook) {
    return this.bookRepository.save(book);
  }

  getBooks() {
    return this.bookRepository.find();
  }

  getBookById(id: number) {
    return this.bookRepository.findOne({ where: { id } });
  }

  enrichBookData(book: IBook) {
    return {
      ...book,
      publishedDate: book.publishedDate.toISOString(),
    };
  }
}
