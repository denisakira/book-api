import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService, MockCacheService } from '../cache/cache.service';
import { mockBook, mockRepository } from '../shared/test.util';
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
});
