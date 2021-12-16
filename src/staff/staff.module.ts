import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        StaffController, ],
    providers: [
        StaffService, ],
})
export class StaffModule {}
