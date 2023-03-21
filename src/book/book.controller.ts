import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, UseFilters } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body() createBookDto: CreateBookDto, @GetUser() user): Promise<CreateBookDto> {
        if (user.role === 'admin') {
            try {
                return this.bookService.create(createBookDto);
            } catch (error) {
                throw new ForbiddenException('Bull')
            }
        } else {
            throw new ForbiddenException('Only admins can perform this action')
        }
    }

    @Get()
    async findAll(): Promise<CreateBookDto[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CreateBookDto> {
        return this.bookService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard())
    async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<UpdateBookDto> {
        return this.bookService.update(id, updateBookDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string): Promise<any> {
        return this.bookService.remove(id);
    }
}