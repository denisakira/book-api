import { mockBook } from 'src/shared/test';
import { OpenLibraryBookEnrichmentService } from './book-data.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('OpenLibraryBookEnrichmentService', () => {
  let service: OpenLibraryBookEnrichmentService;

  // Add mock response data
  const mockResponse = {
    ...mockBook.extra,
  };

  // Mock fetch before tests
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenLibraryBookEnrichmentService],
    }).compile();

    service = module.get<OpenLibraryBookEnrichmentService>(
      OpenLibraryBookEnrichmentService,
    );

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup fetch mock for each test
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
  });

  it('should enrich the book data', async () => {
    // Create book without extra data
    const mockBookWithoutExtra = {
      ...mockBook,
      extra: null,
    };

    // Set up what we expect the enriched data to look like
    const expectedEnrichedBook = {
      ...mockBookWithoutExtra,
      extra: mockResponse, // Use the mock API response data
    };

    const book = await service.enrichBookData(mockBookWithoutExtra);

    expect(fetch).toHaveBeenCalled();
    expect(book).toEqual(expectedEnrichedBook);
  });

  it('should return the book with no extra data if the API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API call failed'));

    const book = await service.enrichBookData(mockBook);
    expect(book).toEqual(mockBook);
  });

  it('should return the book with no extra data if the API call has an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not Found' }),
    });

    const book = await service.enrichBookData(mockBook);
    expect(book).toEqual(mockBook);
  });
});
