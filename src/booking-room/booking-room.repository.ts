import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { GetListDto } from 'src/common/utils/dto/get-list.dto';
import { isNullOrUndefined } from 'src/lib/utils/util';
import { User } from 'src/user/user.entity';
import { Brackets, EntityManager, EntityRepository, Repository } from 'typeorm';
import { BookingRoom } from './booking-room.entity';
import { BookingRoomDto } from './dto/booking-room.dto';

@EntityRepository(BookingRoom)
export class BookingRoomRepository extends Repository<BookingRoom> {

  async createBookingRoom(transactionManager: EntityManager, bookingRoomDto: BookingRoomDto, user: User) {
      try {
        const booking = await transactionManager.create(BookingRoom, {
          bookDate: bookingRoomDto.bookDate,
          startTime: bookingRoomDto.startTime,
          endTime: bookingRoomDto.endTime,
          description: bookingRoomDto.description,
          meetingName: bookingRoomDto.meetingName,
          roomId: bookingRoomDto.roomId,
          userId: user.id
        });
        await transactionManager.save(BookingRoom, booking);
      } catch (error) {
        Logger.error(error);
      }
  }

  async bookingRoomListByUser(user: User, getListDto: GetListDto) {
    const { perPage, page, fullTextSearch } = getListDto;
    const query = await this.createQueryBuilder('booking')
      // .leftJoin('booking.room', 'room')
      .leftJoin('booking.user', 'user')
      .select(['booking', 'user'])
      .where('booking.userId = :id', {id: user.id})
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('booking.createdAt', 'DESC');

    if (!isNullOrUndefined(fullTextSearch) && fullTextSearch != '') {
      query.andWhere(
        new Brackets((sqb) => {
          sqb.andWhere('LOWER(booking.meetingName) LIKE LOWER(:meetingName)', {
            meetingName: `%${fullTextSearch}%`,
          });
          sqb.orWhere('LOWER(booking.description) LIKE LOWER(:description)', {
            description: `%${fullTextSearch}%`,
          });
        }),
      );
    }
    const data = await query.getMany();
    console.log(data);
    const total = await query.getCount();
    return {
      statusCode: 200,
      message: 'Lấy danh sách đặt phòng của tài khoản',
      data: data,
      pagination: { total: total, limit: perPage, offset: page },
    };
  }

  async getBookingRoomList(user: User) {
    const query = await this.createQueryBuilder('booking')
      // .leftJoin('booking.room', 'room')
      .leftJoin('booking.user', 'user')
      .select(['booking', 'user'])
      .where('booking.userId = :id', {id: user.id})
      .orderBy('booking.createdAt', 'DESC');

    const data = await query.getMany();
    console.log(data);
    // const total = await query.getCount();
    return {
      statusCode: 200,
      message: 'Lấy danh sách đặt phòng của tài khoản',
      data: data,
    };
  }


  async bookingRoomListByRoom(user: User, getListDto: GetListDto, room: number) {
    const { perPage, page, fullTextSearch } = getListDto;
    const query = await this.createQueryBuilder('booking')
      // .leftJoin('booking.roon', 'room')
      .leftJoin('booking.user', 'user')
      .select(['booking', 'user'])
      .where('booking.roomId = :id', {id: room})
      .take(perPage)
      .skip((page - 1) * perPage)
      .orderBy('booking.createdAt', 'DESC');

    if (!isNullOrUndefined(fullTextSearch) && fullTextSearch != '') {
      query.andWhere(
        new Brackets((sqb) => {
          sqb.andWhere('LOWER(booking.meetingName) LIKE LOWER(:meetingName)', {
            meetingName: `%${fullTextSearch}%`,
          });
          sqb.orWhere('LOWER(booking.description) LIKE LOWER(:description)', {
            description: `%${fullTextSearch}%`,
          });
        }),
      );
    }
    const data = await query.getMany();
    const total = await query.getCount();
    return {
      statusCode: 200,
      message: 'Lấy danh sách đặt phòng trong 1 ngày.',
      data: data,
      pagination: { total: total, limit: perPage, offset: page },
    };
  }

  async bookingRoomDelete(transactionManager: EntityManager, user: User, id: number){
    return await transactionManager.delete(BookingRoom, {id});
  }

  async deleteBookingRoom(transactionManager: EntityManager, user: User, id: number){
    
    let delBooking = await transactionManager
      .getRepository(BookingRoom)
      .delete({id});

    try {
      return delBooking;
    }
    catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình delete!',
      );
    }
    
    
    // return await transactionManager.delete(BookingRoom, {id});
  }

  async bookingRoomDetail(user: User, id: number) {
    const query = await this.createQueryBuilder('booking')
      .leftJoin('booking.room', 'room')
      .leftJoin('booking.user', 'user')
      .select(['booking', 'user'])
      .where('user.id = :userId', {userId: user.id})
      .andWhere('booking.id = :id', {id})
    
    const data = await query.getOne();
    console.log(data);

    return { statusCode: 200, message: 'Lấy chi tiết thành công.', data: data}
  }

  async bookingRoomEdit(transactionManager: EntityManager, user: User, id: number){
    await transactionManager.update(BookingRoom, {id}, {})
  }
}
