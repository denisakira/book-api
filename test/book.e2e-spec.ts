import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { IBook } from 'src/book/book.interface';

export const sampleIsbn = '9780140328721';
export const sampleOpenLibraryResponse = {
  identifiers: { goodreads: ['1507552'], librarything: ['6446'] },
  title: 'Fantastic Mr. Fox',
  authors: [{ key: '/authors/OL34184A' }],
  publish_date: 'October 1, 1988',
  publishers: ['Puffin'],
  covers: [8739161],
  contributions: ['Tony Ross (Illustrator)'],
  languages: [{ key: '/languages/eng' }],
  source_records: [
    'promise:bwb_daily_pallets_2021-05-13:KP-140-654',
    'ia:fantasticmrfox00dahl_834',
    'marc:marc_openlibraries_sanfranciscopubliclibrary/sfpl_chq_2018_12_24_run02.mrc:85081404:4525',
    'amazon:0140328726',
    'bwb:9780140328721',
    'promise:bwb_daily_pallets_2021-04-19:KP-128-107',
    'promise:bwb_daily_pallets_2020-04-30:O6-BTK-941',
  ],
  local_id: [
    'urn:bwbsku:KP-140-654',
    'urn:sfpl:31223064402481',
    'urn:sfpl:31223117624784',
    'urn:sfpl:31223113969183',
    'urn:sfpl:31223117624800',
    'urn:sfpl:31223113969225',
    'urn:sfpl:31223106484539',
    'urn:sfpl:31223117624792',
    'urn:sfpl:31223117624818',
    'urn:sfpl:31223117624768',
    'urn:sfpl:31223117624743',
    'urn:sfpl:31223113969209',
    'urn:sfpl:31223117624750',
    'urn:sfpl:31223117624727',
    'urn:sfpl:31223117624776',
    'urn:sfpl:31223117624719',
    'urn:sfpl:31223117624735',
    'urn:sfpl:31223113969241',
    'urn:bwbsku:KP-128-107',
    'urn:bwbsku:O6-BTK-941',
  ],
  type: { key: '/type/edition' },
  first_sentence: {
    type: '/type/text',
    value: 'Down in the valley there were three farms.',
  },
  key: '/books/OL7353617M',
  number_of_pages: 96,
  works: [{ key: '/works/OL45804W' }],
  classifications: {},
  ocaid: 'fantasticmrfoxpu00roal',
  isbn_10: ['0140328726'],
  isbn_13: ['9780140328721'],
  latest_revision: 26,
  revision: 26,
  created: { type: '/type/datetime', value: '2008-04-29T13:35:46.876380' },
  last_modified: {
    type: '/type/datetime',
    value: '2023-09-05T03:42:15.650938',
  },
};

describe('BookController (e2e)', () => {
  let app: INestApplication;

  const payload: Omit<IBook, 'id'> = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publishedDate: new Date(),
    isbn: sampleIsbn,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST - /book', () => {
    it('should create a book with extra data using open library', async () => {
      const response = await request(app.getHttpServer())
        .post('/book')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        ...payload,
        publishedDate: payload.publishedDate.toISOString(),
        extra: sampleOpenLibraryResponse,
      });
    });

    it('should create a book with null extra data if the ISBN is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/book')
        .send({ ...payload, isbn: 'invalid' })
        .expect(201);

      expect(response.body.extra).toEqual(null);
    });
  });

  describe('GET - /book/:id', () => {
    it('should return a book', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/book')
        .send(payload)
        .expect(201);

      const createdBook = createResponse.body;

      const getResponse = await request(app.getHttpServer())
        .get(`/book/${createdBook.id}`)
        .expect(200);

      expect(getResponse.body).toEqual(createdBook);
    });

    it('should return 404 if the book is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/book/0')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });

  describe('PATCH - /book/:id', () => {
    it('should update a book', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/book')
        .send(payload)
        .expect(201);

      const bookId = createResponse.body.id;

      const updateResponse = await request(app.getHttpServer())
        .patch(`/book/${bookId}`)
        .send({ ...payload, title: 'Updated Title' })
        .expect(200);

      expect(updateResponse.body.title).toEqual('Updated Title');
    });

    it('should return 404 if the book is not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/book/0')
        .send(payload)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });

  describe('DELETE - /book/:id', () => {
    it('should delete a book', async () => {
      // First create a book
      const createResponse = await request(app.getHttpServer())
        .post('/book')
        .send(payload)
        .expect(201);

      const bookId = createResponse.body.id;

      // Then delete it
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/book/${bookId}`)
        .expect(200);

      expect(deleteResponse.body).toEqual({ success: true });

      // Verify it's gone
      await request(app.getHttpServer()).get(`/book/${bookId}`).expect(404);
    });

    it('should return 404 if the book is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/book/0')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Book not found',
        statusCode: 404,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
