import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import * as mongooseHistory from 'mongoose-history';

export const mongooseConfig = MongooseModule.forRootAsync({
  useFactory: () => {
    mongoose.plugin(mongooseDelete, {
      deletedAt: true,
      overrideMethods: true,
    });
    mongoose.plugin(mongooseHistory);
    return {
      uri: 'mongodb://localhost:27017/virtual-library-db',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      connectionFactory: (connection) => {
        connection.plugin(mongooseDelete, {
          deletedAt: true,
          overrideMethods: true,
        });
        connection.plugin(mongooseHistory);
        return connection;
      },
    };
  },
});