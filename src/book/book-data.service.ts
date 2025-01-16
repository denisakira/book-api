import { Injectable } from '@nestjs/common';
import { IBook, OpenLibraryResponse } from './book.interface';

export interface BookEnrichmentService {
  enrichBookData(book: IBook): Promise<IBook>;
}
export const BookEnrichmentService = Symbol('BookEnrichmentService');

@Injectable()
export class OpenLibraryBookEnrichmentService implements BookEnrichmentService {
  private readonly openLibraryApi = 'https://openlibrary.org/isbn';

  async enrichBookData(book: IBook): Promise<IBook | null> {
    try {
      const response = await fetch(`${this.openLibraryApi}/${book.isbn}.json`);
      const data = (await response.json()) as OpenLibraryResponse;
      return {
        ...book,
        extra: data ? { ...data } : null,
      };
    } catch (error) {
      return {
        ...book,
        extra: null,
      };
    }
  }
}

@Injectable()
export class MockBookEnrichmentService implements BookEnrichmentService {
  async enrichBookData(book: IBook): Promise<IBook> {
    const mockExtraData = {
      test: 'test',
    };

    return Promise.resolve({
      ...book,
      extra: mockExtraData,
    });
  }
}
