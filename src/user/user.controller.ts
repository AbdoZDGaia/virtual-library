import { Controller, Post, Body, Get, UseGuards, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRegisterDto } from './dto/user-register.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GetUser } from './get-user.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiBody({ type: UserRegisterDto })
    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto): Promise<{ token: string }> {
        return this.userService.register(userRegisterDto);
    }

    @ApiBody({ type: UserLoginDto })
    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto): Promise<{ token: string }> {
        return this.userService.login(userLoginDto);
    }

    @Get('logout')
    @UseGuards(AuthGuard())
    async logout(): Promise<void> {
        return this.userService.logout();
    }

    @Get('reserved-books')
    @UseGuards(AuthGuard())
    async findReservedBooks(@Query() queryDto: PaginationQueryDto, @GetUser() user) {
        if (user.role === 'admin') {
            return this.userService.findReservedBooks(queryDto);
        } else {
            return this.userService.findReservedBooks({ ...queryDto }, user._id);
        }
    }

    @Get('reserve/:bookId')
    @UseGuards(AuthGuard())
    async reserveBookForUser(@Param('bookId') bookId: string, @GetUser() user) {
        return this.userService.reserveBook(user.id, bookId)
    }

    @Get('return/:bookId')
    @UseGuards(AuthGuard())
    async returnBookByUser(@Param('bookId') bookId: string, @GetUser() user) {
        return this.userService.returnBook(user.id, bookId)
    }

}