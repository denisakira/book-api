import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { IBook } from 'src/book/book.interface';

describe('BookController (e2e)', () => {
  let app: INestApplication;

  const payload: Omit<IBook, 'id'> = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publishedDate: new Date(),
    isbn: '1234567890',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/book (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/book')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      ...payload,
      publishedDate: payload.publishedDate.toISOString(),
    });
  });

  it('/book/:id (GET)', async () => {
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

  afterAll(async () => {
    await app.close();
  });
});
