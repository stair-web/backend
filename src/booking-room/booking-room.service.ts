import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetListDto } from 'src/common/utils/dto/get-list.dto';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { User } from 'src/user/user.entity';
import { EntityManager } from 'typeorm';
import { BookingRoom } from './booking-room.entity';
import { BookingRoomRepository } from './booking-room.repository';
import { BookingRoomDto } from './dto/booking-room.dto';

@Injectable()
export class BookingRoomService {
    constructor(
        private bookingRoomRepository: BookingRoomRepository,
    ){}
    async createBookingRoom(transactionManager: EntityManager, bookingRoomDto: BookingRoomDto, user: User): Promise<unknown> {
        await this.bookingRoomRepository.createBookingRoom(transactionManager, bookingRoomDto, user);
        return {statusCode: 200, message: 'Tạo đặt phòng thành công.'}
    }

    async bookingRoomListByUser(user: User, getListDto: GetListDto){
        return await this.bookingRoomRepository.bookingRoomListByUser(user, getListDto);
    }

    async getBookingRoomList(user: User){
        return await this.bookingRoomRepository.getBookingRoomList(user);
    }

    async bookingRoomListByRoom(user: User, getListDto: GetListDto, room: number) {
        return await this.bookingRoomRepository.bookingRoomListByRoom(user, getListDto, room);
    }

    async bookingRoomDelete(transactionManager: EntityManager, user: User, id: number) {
        const exxit = await transactionManager.getRepository(BookingRoom).findOne({id, userId: user.id});
        if(isNullOrUndefined(exxit)){
            throw new InternalServerErrorException('Không tìm thấy lịch đặt phòng do bạn tạo.')
        }
        return await this.bookingRoomRepository.bookingRoomDelete(transactionManager, user, id);
    }

    async deleteBookingRoom(transactionManager: EntityManager, user: User, id: number) {
        // const exitt = await transactionManager.getRepository(BookingRoom).findOne({id, userId: user.id});
        // if(isNullOrUndefined(exitt)){
        //     throw new InternalServerErrorException('Không tìm thấy lịch đặt phòng do bạn tạo.')
        // }
        return this.bookingRoomRepository.bookingRoomDelete(transactionManager, user, id);
    }

    async bookingRoomDetail(user: User, id: number) {
        return await this.bookingRoomRepository.bookingRoomDetail(user, id);
    }

    async bookingRoomEdit(transactionManager: EntityManager, user: User, id: number, bookingRoomDto: BookingRoomDto) {
        return await this.bookingRoomRepository.bookingRoomEdit(transactionManager, user, id);
    }
}
