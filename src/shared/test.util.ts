import { IBook } from 'src/book/book.interface';

export const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn(),
};

export const mockBook: IBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test Description',
  publishedDate: new Date(),
  isbn: '1234567890',
  extra: null,
};
