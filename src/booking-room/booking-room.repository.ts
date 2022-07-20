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
import { UpdateBookingRoomDto } from './dto/update-booking-room.dto';

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
    // console.log(data);
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
    // console.log(data);
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
    try {
      await transactionManager.delete(BookingRoom, {id});
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình delete!',
      );
    }
    return { statusCode: 200, message: 'Xoá thành công.'};
  }

  // async deleteBookingRoom(transactionManager: EntityManager, user: User, id: number){
  //   try {
  //     // return delBooking;
  //     let delBooking = await transactionManager.delete(BookingRoom,{id});
  //   }
  //   catch (error) {
  //     Logger.error(error);
  //     throw new InternalServerErrorException(
  //       'Lỗi hệ thống trong quá tình delete!',
  //     );
  //   }
    
  //   return { statusCode: 200, message: 'Xoá thành công.'};
  //   // return await transactionManager.delete(BookingRoom, {id});
  // }

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

  async bookingRoomEdit(transactionManager: EntityManager, user: User, id: number, updateBookingRoomDto: UpdateBookingRoomDto){
    // await transactionManager.update(BookingRoom, {id}, {})
    const { bookDate, startTime, endTime, description, meetingName } = updateBookingRoomDto;

    const bookingRoom = await transactionManager.getRepository(BookingRoom).findOne({id});

    if (isNullOrUndefined(bookingRoom)) {
      throw new InternalServerErrorException('Lịch đặt phòng không tồn tại.');
    }

    try {
      await transactionManager.update(
        BookingRoom,
        { id: bookingRoom.id },
        {
          bookDate: bookDate,
          startTime: startTime,
          endTime: endTime,
          description: description,
          meetingName: meetingName,
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi trong quá trình chỉnh sửa lịch đặt phòng.',
      );
    }
    return { statusCode: 200, message: 'Chỉnh sửa lịch đặt phòng thành công.' };

  }

  async filterMeetingRoomBooking(
    transactionManager: EntityManager,
    fromDate: Date,
    toDate: Date
  ) {
    try {
      const query = transactionManager
        .getRepository(BookingRoom)
        .createQueryBuilder('b')
        .select(
          'b.id, b.room_id, b.user_id, b.book_date, b.start_time, b.end_time, b.meeting_name, b.description',
        );

      if (fromDate) {
        let from = new Date(fromDate);
        query.andWhere('b.bookDate >= :from', {
          from: new Date(from),
        });
      }
      // to.getFullYear() + '-' + (to.getMonth() + 1) + '-' + to.getDate(),
      if (toDate) {
        let to = new Date(toDate);
        query.andWhere('b.bookDate <= :to', {
          to: new Date(to),
        });
      }

      const data = await query.execute();

      return data;
    } catch (error) {
      console.log(error);

      Logger.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống trong quá tình lọc ngày',
      );
    }
  }
}
