import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book/book.controller';
import { UserController } from './user/user.controller';
import { PassportModule } from '@nestjs/passport';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    BookModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/virtual-library-db', {
      autoIndex: false,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ BookController, UserController],
  providers:[],
})
export class AppModule { }
