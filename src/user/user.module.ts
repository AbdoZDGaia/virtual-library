import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BookModule } from 'src/book/book.module';
import { JwtStrategy } from 'src/jwt.strategy';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
            ]),
        PassportModule,
        JwtModule.register({
            secret: 'abdelrahmanssecret',
            signOptions: { expiresIn: '1h' },
          }),
        BookModule
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [UserService],
})
export class UserModule { }
