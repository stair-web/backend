import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { GetListDto } from 'src/common/utils/dto/get-list.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { Connection, TransactionManager } from 'typeorm';
import { BookingRoomService } from './booking-room.service';
import { BookingRoomDto } from './dto/booking-room.dto';

@Controller('booking-room')
@ApiTags('Booking-room')
export class BookingRoomController {
    constructor(
        private readonly connection: Connection,
        private readonly bookingRoomService: BookingRoomService,
    ){}

    @Post()
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Tạo lịch đặt phòng.' })
    async createBookingRoom(@Body(ValidationPipe) bookingRoomDto: BookingRoomDto, @GetUser() user: User) {
        return await this.connection.transaction((transactionManager) => {
            return this.bookingRoomService.createBookingRoom(transactionManager, bookingRoomDto, user);
        });
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Lấy danh sách lịch đặt phòng của người dùng.' })
    async bookingRoomListByUser(@GetUser() user: User, @Query() getListDto: GetListDto) {
        return this.bookingRoomService.bookingRoomListByUser(user, getListDto);
    }

    @Get('/list')
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Lấy danh sách đặt phòng.' })
    async getBookingRoomList(@GetUser() user: User) {
        return this.bookingRoomService.getBookingRoomList(user);
    }

    @Get(':roomId')
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Lấy danh sách lịch đặt phòng trong 1 ngày.' })
    async bookingRoomListByRoom(@GetUser() user: User, @Query() getListDto: GetListDto, @Param('roomId')room: number) {
        return this.bookingRoomService.bookingRoomListByRoom(user, getListDto, room);
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiResponse({
        status: 201,
        description: 'Delete thành công.',
      })
    @ApiOperation({ summary: 'Xoá lịch đặt phòng.' })
    async bookingRoomDelete(@Param('id') id: number, @GetUser() user: User) {
        return await this.connection.transaction((transactionManager) => {
            return this.bookingRoomService.bookingRoomDelete(transactionManager, user, id);
        });
    }

    @Delete('/delete/:id')
    @UseGuards(RolesGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Delete thành công.',
    })
    @ApiOperation({ summary: 'Delete booking' })
    async deleteBookingRoom(@Param('id') id: number, @GetUser() user: User) {
        return await this.connection.transaction((transactionManager) => {
            return this.bookingRoomService.deleteBookingRoom(transactionManager, user, id);
        });
    }


    @Get('detail/:id')
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Lấy chi tiết lịch đặt phòng.' })
    async bookingRoomDetail(@GetUser() user: User, @Param('id') id: number) {
        return this.bookingRoomService.bookingRoomDetail(user, id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Chỉnh sửa chi tiết lịch đặt phòng.' })
    async bookingRoomEdit(@GetUser() user: User, @Param('id') id: number, @Body() bookingRoomDto: BookingRoomDto,) {
        return await this.connection.transaction((transactionManager) => {
            return this.bookingRoomService.bookingRoomEdit(transactionManager,user, id, bookingRoomDto);
        });
    }
}
