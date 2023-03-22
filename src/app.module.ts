import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from './book/book.controller';
import { UserController } from './user/user.controller';
import { PassportModule } from '@nestjs/passport';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { mongooseConfig } from 'mongoose-config';

@Module({
  imports: [
    BookModule,
    UserModule,
    mongooseConfig,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ BookController, UserController],
  providers:[],
})
export class AppModule { }
