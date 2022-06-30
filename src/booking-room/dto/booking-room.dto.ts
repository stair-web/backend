import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BookingRoomDto {

  @IsNotEmpty()
  @ApiProperty()
  bookDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  startTime: Date;

  @IsNotEmpty()
  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  roomId: number;

  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  meetingName: string;
}
