import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { Repository } from 'typeorm';
import { BookEnrichmentService } from './book-data.service';
import { Book } from './book.entity';
import { IBook } from './book.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private cacheService: CacheService,
    @Inject(BookEnrichmentService)
    private bookEnrichmentService: BookEnrichmentService,
  ) {}

  async createBook(book: IBook): Promise<IBook> {
    // First enrich the book data
    const enrichedBook = await this.bookEnrichmentService.enrichBookData(book);

    // Save to database
    const savedBook = await this.bookRepository.save(enrichedBook);

    // Cache the newly created book
    await this.cacheService.set(`book:${savedBook.id}`, savedBook, 3600); // 1 hour TTL

    return savedBook;
  }

  async getBook(id: number): Promise<IBook | undefined> {
    // Try cache first
    const cachedBook = await this.cacheService.get<IBook>(`book:${id}`);
    if (cachedBook) {
      return cachedBook;
    }

    // If not in cache, get from DB
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Save to cache
    await this.cacheService.set(`book:${id}`, book, 3600);

    return book;
  }

  async updateBook(id: number, payload: Partial<IBook>): Promise<IBook> {
    const existingRecord = await this.bookRepository.findOneBy({ id });

    if (!existingRecord) {
      throw new NotFoundException('Book not found');
    }

    let updatedBook: IBook;
    // If the isbn field is updated, enrich the book data
    if (payload.isbn && payload.isbn !== existingRecord.isbn) {
      updatedBook = await this.bookEnrichmentService.enrichBookData({
        ...existingRecord,
        ...payload,
      });
    } else {
      updatedBook = {
        ...existingRecord,
        ...payload,
      };
    }

    // Save to database
    const savedBook = await this.bookRepository.save(updatedBook);

    // Update cache
    await this.cacheService.set(`book:${id}`, savedBook, 3600);

    return savedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    // Remove from cache regardless of result
    await this.cacheService.del(`book:${id}`);

    if (result.affected === 0) {
      throw new NotFoundException('Book not found');
    }

    return true;
  }
}
