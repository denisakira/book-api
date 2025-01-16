import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookEnrichmentService } from './book-data.service';
import { OpenLibraryBookEnrichmentService } from './book-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: BookEnrichmentService,
      useClass: OpenLibraryBookEnrichmentService,
    },
  ],
})
export class BookModule {}
