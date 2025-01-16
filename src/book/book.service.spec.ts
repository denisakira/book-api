import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService, MockCacheService } from '../cache/cache.service';
import { mockBook, mockRepository } from '../shared/test';
import {
  BookEnrichmentService,
  MockBookEnrichmentService,
} from './book-data.service';
import { Book } from './book.entity';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;
  let cacheService: CacheService;
  let bookEnrichmentService: BookEnrichmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
        {
          provide: BookEnrichmentService,
          useClass: MockBookEnrichmentService,
        },
        {
          provide: CacheService,
          useClass: MockCacheService,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    cacheService = module.get<CacheService>(CacheService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
    bookEnrichmentService = module.get<BookEnrichmentService>(
      BookEnrichmentService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the cache and if nothing is found then call the repository', async () => {
    const getRepositorySpy = jest
      .spyOn(repository, 'findOneBy')
      .mockImplementationOnce(() => Promise.resolve(mockBook));
    const cacheServiceSpy = jest.spyOn(cacheService, 'get');

    await service.getBook(1);

    expect(cacheServiceSpy).toHaveBeenCalledWith('book:1');
    expect(getRepositorySpy).toHaveBeenCalled();
  });

  it('should call the enrichment service when a book is created', async () => {
    const createBookRepositorySpy = jest
      .spyOn(repository, 'save')
      .mockImplementationOnce(() => Promise.resolve(mockBook));
    const enrichmentServiceSpy = jest.spyOn(
      bookEnrichmentService,
      'enrichBookData',
    );

    await service.createBook(mockBook);

    expect(enrichmentServiceSpy).toHaveBeenCalled();
    expect(createBookRepositorySpy).toHaveBeenCalled();
  });

  it('should not call the enrichment service when a book is updated with the same isbn', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementationOnce(() => Promise.resolve(mockBook));

    const updateBookRepositorySpy = jest
      .spyOn(repository, 'save')
      .mockImplementationOnce(() => Promise.resolve(mockBook));
    const enrichmentServiceSpy = jest.spyOn(
      bookEnrichmentService,
      'enrichBookData',
    );

    await service.updateBook(1, mockBook);

    expect(enrichmentServiceSpy).not.toHaveBeenCalled();
    expect(updateBookRepositorySpy).toHaveBeenCalled();
  });

  it('should call the enrichment service when a book is updated with a different isbn', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementationOnce(() => Promise.resolve(mockBook));

    const updateBookRepositorySpy = jest
      .spyOn(repository, 'save')
      .mockImplementationOnce(() => Promise.resolve(mockBook));
    const enrichmentServiceSpy = jest.spyOn(
      bookEnrichmentService,
      'enrichBookData',
    );

    await service.updateBook(1, { ...mockBook, isbn: 'new' });

    expect(enrichmentServiceSpy).toHaveBeenCalled();
    expect(updateBookRepositorySpy).toHaveBeenCalled();
  });

  it('should call the cache service when a book is created', async () => {
    const cacheServiceSpy = jest.spyOn(cacheService, 'set');
    jest
      .spyOn(repository, 'save')
      .mockImplementationOnce(() => Promise.resolve(mockBook));

    await service.createBook(mockBook);

    expect(cacheServiceSpy).toHaveBeenCalled();
  });

  it('should call the cache service when a book is updated', async () => {
    const cacheServiceSpy = jest.spyOn(cacheService, 'set');
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementationOnce(() => Promise.resolve(mockBook));

    await service.updateBook(1, mockBook);

    expect(cacheServiceSpy).toHaveBeenCalled();
  });

  it('should delete the book from the cache when a book is deleted', async () => {
    const cacheServiceSpy = jest.spyOn(cacheService, 'del');
    jest
      .spyOn(repository, 'delete')
      .mockImplementationOnce(() => Promise.resolve({ affected: 1, raw: [] }));

    await service.deleteBook(1);

    expect(cacheServiceSpy).toHaveBeenCalled();
  });

  it('should call the repository find method when getBooks is called', async () => {
    const findSpy = jest
      .spyOn(repository, 'find')
      .mockImplementationOnce(() => Promise.resolve([mockBook]));

    const books = await service.getBooks();

    expect(findSpy).toHaveBeenCalled();
    expect(books).toEqual([mockBook]);
  });
});
