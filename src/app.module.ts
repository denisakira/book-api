import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { getDataSourceOptions } from './orm-config';
import { RedisCacheModule } from './cache/cache.module';

@Module({
  imports: [
    BookModule,
    TypeOrmModule.forRoot(getDataSourceOptions()),
    RedisCacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
