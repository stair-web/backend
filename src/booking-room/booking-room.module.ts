import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRoomController } from './booking-room.controller';
import { BookingRoomRepository } from './booking-room.repository';
import { BookingRoomService } from './booking-room.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    BookingRoomRepository
  ])],
  controllers: [BookingRoomController],
  providers: [BookingRoomService]
})
export class BookingRoomModule {}
