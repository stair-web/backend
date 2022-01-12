import { DayoffService } from './dayoff.service';
import { DayoffController } from './dayoff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DayoffRepository } from './dayoff.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DayoffRepository]),
    ],
    controllers: [
        DayoffController, ],
    providers: [
        DayoffService, ],
})
export class DayoffModule {}
