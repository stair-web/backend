import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { EntityManager } from 'typeorm';
import { AddRoomDto } from './dto/add-room.dto';
import { Room } from './model/room.entity';

@Injectable()
export class RoomService {
    async saveRoom(transactionManager: EntityManager, addRoomDto: AddRoomDto, user: User) {
        const { roomCode, roomName } = addRoomDto;
        try {
            const room = await transactionManager.create(Room, { roomCode, roomName })
            await transactionManager.save(Room, room);
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Lỗi khi lưu phòng.')
        }

    }

}
