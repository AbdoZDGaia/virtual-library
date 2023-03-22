import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Book } from 'src/book/book.entity';
import { BookService } from 'src/book/book.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly bookService: BookService) { }

    async register(userRegisterDto: UserRegisterDto): Promise<{ token: string }> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userRegisterDto.password, salt);
        const createdUser = new this.userModel({
            ...userRegisterDto,
            password: hashedPassword,
        });
        const savedUser = await createdUser.save();
        const token = this.jwtService.sign({ id: savedUser._id, role: savedUser.role });
        return { token };
    }

    async login(userLoginDto: UserLoginDto): Promise<{ token: string }> {
        const user = await this.userModel.findOne({ name: userLoginDto.name });
        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(userLoginDto.password, user.password);
        if (!isMatch) {
            throw new ForbiddenException('Invalid credentials');
        }
        const token = this.jwtService.sign({ id: user._id, role: user.role });
        return { token };
    }

    async logout(): Promise<void> {
        localStorage.removeItem('token');
        //remove the token from client side
    }

    async reserveBook(userId: string, bookId: string) {
        this.checkValidBookId(bookId);
        const  book = await this.bookService.findOne(bookId);
        const userToBeUpdated = await this.userModel.findById(userId);
        const alreadyReserved = this.isAlreadyReservedForUser(userToBeUpdated, book);
        if (alreadyReserved) {
            throw new BadRequestException('This user has already reserved this book');
        }
        else {
            await this.bookService.reserve(book);
            userToBeUpdated.reservedBooks.push({ bookName: book.name, reservationDate: new Date() });
            await this.userModel.findByIdAndUpdate(userId, { $set: userToBeUpdated })
        }
    }

    async returnBook(userId: string, bookId: string) {
        this.checkValidBookId(bookId);
        const book = await this.bookService.findOne(bookId);
        const userToBeUpdated = await this.userModel.findById(userId);
        userToBeUpdated.reservedBooks = userToBeUpdated.reservedBooks.filter(obj =>
            obj.bookName !== book.name);
        await this.bookService.return(book);
        await this.userModel.findByIdAndUpdate(userId, { $set: userToBeUpdated })
    }

    async findReservedBooks(queryDto: PaginationQueryDto, userId?: string) {
        const match = userId ? { _id: userId } : {};
        queryDto.limit ??= 10;
        queryDto.offset ??= 0;
        const result = await this.userModel.aggregate([
            { $match: match },
            { $unwind: '$reservedBooks' },
            {
                $match: {
                    'reservedBooks.reservationDate': {
                        $gte: queryDto.start ? new Date(queryDto.start) : new Date(),
                        $lte: queryDto.end ? new Date(queryDto.end) : new Date(),
                    },
                },
            },
            {
                $group: {
                    _id: '$reservedBooks.bookName',
                    count: { $sum: 1 },
                },
            },
        ])
            .skip(queryDto.offset)
            .limit(queryDto.limit);
        return result;
    }

    private isAlreadyReservedForUser(userToBeUpdated: User, book: Book) {
        if (userToBeUpdated.reservedBooks.length > 0) {
            const alreadyReserved = userToBeUpdated.reservedBooks.find((obj) => {
                return obj.bookName === book.name;
            });
            if (alreadyReserved)
                return true
            return false
        }
        return false
    }

    private checkValidBookId(bookId: string) {
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException('Invalid Book Id');
        }
    }
}
