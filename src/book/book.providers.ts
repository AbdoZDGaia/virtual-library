import { Mongoose } from 'mongoose';
import { BookSchema } from './book.entity';

export const bookProviders = [
  {
    provide: 'BOOK_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Book', BookSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
