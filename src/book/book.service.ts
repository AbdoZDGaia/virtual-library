import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class BookService {
    constructor(
        @InjectModel('Book') private readonly bookModel: SoftDeleteModel<Book>,
        @InjectModel('History') private readonly historyModel: Model<History>) { }

    async create(book: CreateBookDto): Promise<Book> {
        await this.chekForDuplicateName(book.name);
        const createdBook = new this.bookModel(book);
        const savedBook = createdBook.save();
        return savedBook
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async findOne(id: string): Promise<Book> {
        const book = (await this.bookModel.find({ id: id }).exec()).at(0);
        if (!book) {
            throw new NotFoundException(`The book with Id:${id} was not found`);
        }
        return book;
    }

    async update(id: string, book: UpdateBookDto): Promise<Book> {
        const bookBeforeUpdate = await this.findOne(id);
        if (!bookBeforeUpdate)
            throw new NotFoundException('No such record was found');
        const result = await this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
        await this.auditBookUpdate(bookBeforeUpdate);
        return result;
    }

    async remove(id: string) {
        const filter = { _id: id };
        const deletedBook = await this.findOne(id);
        const deleted = await this.bookModel.softDelete(filter);
        this.auditBookDelete(id, deletedBook);
        return deleted;
    }

    async reserve(book: Book) {
        if (book.quantity > 0) {
            book.quantity--;
            this.update(book.id, book);
        }
        else {
            throw new BadRequestException('Could not reserve this book, fully reserved')
        }
    }

    async return(book: Book) {
        book.quantity++;
        this.update(book.id, book);
    }

    private auditBookDelete(id: string, deletedBook: Book) {
        const updateLogForBookDocument = new this.historyModel({
            collectionName: 'Book',
            documentId: id,
            document: { book: deletedBook },
            operation: 'delete'
        });
        updateLogForBookDocument.save();
    }

    private async auditBookUpdate(bookBeforeUpdate: Book) {
        const updateLogForBookDocument = new this.historyModel({
            collectionName: 'Book',
            document: { book: bookBeforeUpdate },
            operation: 'update'
        });
        await updateLogForBookDocument.save();
    }

    private async chekForDuplicateName(bookName: string) {
        const foundName = await this.bookModel.findOne({ name: bookName });
        if (foundName) {
            throw new BadRequestException('Duplicate book name');
        }
    }
}