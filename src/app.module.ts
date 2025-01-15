import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { dataSourceOptionsCallback } from './orm-config';

@Module({
  imports: [BookModule, TypeOrmModule.forRoot(dataSourceOptionsCallback())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
