import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch } from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Books')
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    @UseGuards(AuthGuard())
    @ApiBody({ type: CreateBookDto })
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
    @ApiBody({ type: UpdateBookDto })
    async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<UpdateBookDto> {
        return this.bookService.update(id, updateBookDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string): Promise<any> {
        return this.bookService.remove(id);
    }
}