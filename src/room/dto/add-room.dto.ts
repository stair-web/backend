import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddRoomDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    roomCode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    roomName: string;
}