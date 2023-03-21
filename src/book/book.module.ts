import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from 'src/user/history.entity';
import { BookController } from './book.controller';
import { Book, BookSchema } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: History.name, schema: HistorySchema },
    ]),]
  ,
  controllers: [BookController],
  providers: [BookService],
  exports:[BookService]
})
export class BookModule {
}
