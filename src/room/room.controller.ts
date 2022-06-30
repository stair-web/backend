import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { Connection } from 'typeorm';
import { AddRoomDto } from './dto/add-room.dto';
import { RoomService } from './room.service';

@Controller('room')
@ApiTags('Room')
export class RoomController {
    constructor(
        private readonly connection: Connection,
        private readonly roomService: RoomService,
    ){}

    @Post()
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    async addRooom(@Body(ValidationPipe) addRoomDto: AddRoomDto, @GetUser() user: User) {
        return await this.connection.transaction((transactionManager) => {
            return this.roomService.saveRoom(transactionManager, addRoomDto, user);
        });
    }
}
