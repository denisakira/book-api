import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IBook, OpenLibraryResponse } from './book.interface';

@Entity()
export class Book implements IBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  publishedDate: Date;

  @Column()
  isbn: string;

  @Column({ type: 'jsonb', nullable: true })
  extra?: OpenLibraryResponse | null;
}
