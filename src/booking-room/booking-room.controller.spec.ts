import { Test, TestingModule } from '@nestjs/testing';
import { BookingRoomController } from './booking-room.controller';

describe('BookingRoomController', () => {
  let controller: BookingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingRoomController],
    }).compile();

    controller = module.get<BookingRoomController>(BookingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
