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
        return this.bookModel.findById(id).exec();
    }

    async update(id: string, book: UpdateBookDto): Promise<Book> {
        const bookBeforeUpdate = await this.findOne(id);
        if (!bookBeforeUpdate)
            throw new NotFoundException('No such record was found');
        await this.checkSoftDeletedById(id);
        const result = await this.bookModel.findByIdAndUpdate(id, book, { new: true }).exec();
        await this.auditBookUpdate(bookBeforeUpdate);
        return result;
    }

    async remove(id: string): Promise<any> {
        const filter = { _id: id };
        const deletedBook = await this.findOne(id);
        const deleted = await this.bookModel.softDelete(filter);

        if (deleted.deleted === 0) {
            throw new BadRequestException('Already deleted')
        }
        this.auditBookDelete(id, deletedBook);
        return deleted;
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

    private async checkSoftDeletedById(id: string) {
        const deletedBooks = await this.bookModel.findDeleted();
        const found = deletedBooks.find((obj) => {
            return obj.id === id;
        });
        if (found) {
            throw new BadRequestException('Already deleted');
        }
    }

    private async chekForDuplicateName(bookName: string) {
        const foundName = await this.bookModel.findOne({name:bookName});
        console.log(foundName);
        if (foundName) {
            throw new BadRequestException('Duplicate book name');
        }
    }
}