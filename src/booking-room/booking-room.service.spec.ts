import { Test, TestingModule } from '@nestjs/testing';
import { BookingRoomService } from './booking-room.service';

describe('BookingRoomService', () => {
  let service: BookingRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingRoomService],
    }).compile();

    service = module.get<BookingRoomService>(BookingRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
